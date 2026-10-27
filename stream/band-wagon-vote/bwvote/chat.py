"""Read-only anonymous Twitch chat reader (justinfan login, no token, cannot post)."""
import random
import socket
import ssl
import threading
import time


def parse_privmsg(line):
    """':user!user@user.tmi.twitch.tv PRIVMSG #chan :text' -> (user, text) or None."""
    if " PRIVMSG " not in line:
        return None
    if line.startswith("@"):
        line = line.split(" ", 1)[1]
    prefix, _, rest = line.partition(" PRIVMSG ")
    user = prefix.lstrip(":").split("!", 1)[0]
    _, _, text = rest.partition(" :")
    return user.lower(), text.strip()


def read_chat(channel, on_message, stop, host="irc.chat.twitch.tv", port=6697, tls=True):
    """Blocks until `stop` (a threading.Event) is set; reconnects after a drop."""
    while not stop.is_set():
        try:
            s = socket.create_connection((host, port), timeout=30)
            if tls:
                s = ssl.create_default_context().wrap_socket(s, server_hostname=host)
            s.settimeout(5)
            s.sendall(f"PASS SCHMOOPIIE\r\nNICK justinfan{random.randint(10000, 99999)}\r\nJOIN #{channel}\r\n".encode())
            buf = b""
            while not stop.is_set():
                try:
                    data = s.recv(4096)
                except (TimeoutError, socket.timeout):
                    continue
                if data == b"":
                    break
                buf += data
                while b"\r\n" in buf:
                    raw, buf = buf.split(b"\r\n", 1)
                    line = raw.decode("utf-8", "replace")
                    if line.startswith("PING"):
                        s.sendall(b"PONG :tmi.twitch.tv\r\n")
                    m = parse_privmsg(line)
                    if m:
                        on_message(*m)
            s.close()
        except OSError:
            stop.wait(5)


def start(channel, on_message, stop, **kw):
    t = threading.Thread(target=read_chat, args=(channel, on_message, stop), kwargs=kw, daemon=True)
    t.start()
    return t
