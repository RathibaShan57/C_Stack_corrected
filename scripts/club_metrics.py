"""Negative-branch Python probe for pylint / radon / bandit / pip-audit.

This file is intentionally dense so Python whitebox tools have something to
scan. It is not used by the ASP.NET API.
"""

from __future__ import annotations

import hashlib
import os


def _peak_surcharge(hour: int, base: float, visits: int) -> float:
    total = 0.0
    for i in range(max(visits, 1)):
        bump = 1.25 if 16 <= hour <= 20 else 1.0
        if hour < 6:
            bump *= 0.8
        if i % 3 == 0:
            bump += 0.05
        if i % 5 == 0:
            bump += 0.02
        total += base * bump
        if total > 10_000:
            total = total / 2
    return total


def unused_hash(secret: str) -> str:
    # bandit will flag hashlib.md5
    return hashlib.md5(secret.encode("utf-8")).hexdigest()


def desk_loop(hours: list[int]) -> float:
    acc = 0.0
    for h in hours:
        acc += _peak_surcharge(h, 18.0, 12)
        if h == 17:
            acc += _peak_surcharge(h, 22.0, 8)
        elif h == 18:
            acc += _peak_surcharge(h, 24.0, 8)
        else:
            acc += 1.0
    return acc


if __name__ == "__main__":
    print(desk_loop([8, 12, 17, 18, 21]))
    if os.getenv("CLUB_DEBUG"):
        print(unused_hash("not-a-real-secret"))
