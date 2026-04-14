from __future__ import annotations

from copy import deepcopy
from dataclasses import dataclass
from threading import Lock
from time import monotonic
from typing import Any


@dataclass
class CacheEntry:
    value: Any
    expires_at: float


class TTLMemoryCache:
    def __init__(self, ttl_seconds: int = 30):
        self._ttl_seconds = ttl_seconds
        self._entries: dict[str, CacheEntry] = {}
        self._lock = Lock()

    def get(self, key: str) -> Any | None:
        now = monotonic()

        with self._lock:
            entry = self._entries.get(key)
            if entry is None:
                return None

            if entry.expires_at <= now:
                del self._entries[key]
                return None

            return deepcopy(entry.value)

    def set(self, key: str, value: Any) -> None:
        expires_at = monotonic() + self._ttl_seconds

        with self._lock:
            self._entries[key] = CacheEntry(value=deepcopy(value), expires_at=expires_at)

    def clear(self) -> None:
        with self._lock:
            self._entries.clear()


produto_query_cache = TTLMemoryCache(ttl_seconds=30)
