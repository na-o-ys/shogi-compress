# shogi-compress

`shogi-compress` is a kifu (棋譜) encoder / decoder.

It encodes SFEN and produces compressed urlquery-safe string.

## Examples

A sample SFEN of a game which has 113 moves:

```
position startpos moves 2g2f 8c8d 7g7f 4a3b 2f2e 8d8e 8h7g 3c3d 7i6h 2b7g+ 6h7g 3a2b 3i4h
2b3c 3g3f 7a6b 4g4f 6c6d 2i3g 5a4b 6i7h 6b6c 5i6h 7c7d 4h4g 8a7c 9g9f 9c9d 1g1f 1c1d 4i4h
8b8a 2h2i 6a5b 6g6f 5b6b 4g5f 6c5d 6h7i 4b5b 7i8h 5b4b 3g4e 3c4d 2e2d 2c2d 2i2d P*2c 2d2i
6d6e 6f6e 7d7e P*2b 3b2b 8h7i 2b3b P*2b 3b2b 3f3e 7e7f 7g7f 8e8f 8g8f 8a8f 7f7e 8f8a P*8b
8a8b B*7a 8b7b 7a6b+ 7b6b P*7d 7c6e 7d7c+ 6b6a 7c7b 6a3a 7e6f P*6d 3e3d 3a3d 7b6b 2c2d P*3c
5d4e 4f4e 4d3c 4e4d 4c4d 6f6e 6d6e N*4f 3d3f 5f4g 3f3e S*3f 3e5e 4g5f 5e5f 5g5f 4b3b 6b6c
3b2c 6c5c B*6d 3f3e 6d4f 3e4f N*6f R*7b P*7a B*3d
```

Compressed string whose length is 158:

```
csv2_bm-mVA-9RXQKKprFkLEoY2bw4PkI9n8fH9py-anUyRsuRhmYz5yhu8P5LBAjTfGV_.UcLXQt5LNx5mVy7sdbWbBPKc~TFss93TMVrsvt7yuT.xojVQ1j_2y_KSlfobJu6Of4W3DEVaSryBsQqax4HUXWJ
```

## Usage

```
$ node build/cli.js encode v2 '{SFEN string}'
$ node build/cli.js decode '{compressed string}'
```
