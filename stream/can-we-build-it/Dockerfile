# syntax=docker/dockerfile:1
# Stage 1: base: stdlib-only Python for the parts bin, checker and geometry export
FROM python:3.12-slim AS base
RUN useradd -m -u 1000 appuser
WORKDIR /app
COPY --chown=appuser:appuser src/ src/
COPY --chown=appuser:appuser schema/ schema/
COPY --chown=appuser:appuser data/ data/
COPY --chown=appuser:appuser builds/ builds/
RUN mkdir -p output published && chown appuser:appuser output published
USER appuser
ENV PYTHONPATH=/app/src PYTHONDONTWRITEBYTECODE=1
CMD ["python3", "-m", "partsbin", "--help"]

# Stage 2: test: the full unittest suite
FROM base AS test
COPY --chown=appuser:appuser tests/ tests/
CMD ["python3", "-m", "unittest", "discover", "-s", "tests", "-v"]

# Stage 3: blender: headless Blender 4.5 LTS for renders only (copied from ada-stair-generator)
FROM debian:trixie-slim AS blender
RUN --mount=type=cache,target=/var/cache/apt \
    --mount=type=cache,target=/var/lib/apt \
    apt-get update && apt-get install -y --no-install-recommends \
      libx11-6 libxi6 libxfixes3 libxrender1 libxkbcommon0 libxext6 libsm6 libgl1 && \
    rm -rf /var/lib/apt/lists/*
# download.blender.org answers with a Cloudflare challenge; the Clarkson mirror serves the same
# files, and the checksum is the one published in blender-4.5.14.sha256.
ADD --checksum=sha256:9ba871ff2ecd36526b77432745980b7e6664ecd0c7ca11c48849073dcfe06da3 --unpack=true \
    https://mirror.clarkson.edu/blender/release/Blender4.5/blender-4.5.14-linux-x64.tar.xz /opt/
RUN ln -s /opt/blender-4.5.14-linux-x64/blender /usr/local/bin/blender
RUN useradd -m -u 1000 appuser
WORKDIR /app
USER appuser
CMD ["blender", "--version"]
