import { encode, decode } from ".";

const command = process.argv[2];

if (command === "encode") {
  const version = process.argv[3];
  const body = process.argv[4];
  if (version === "v1") {
    console.log(encode(body, "v1"));
  }
  if (version === "v2") {
    console.log(encode(body, "v2"));
  }
}

if (command === "decode") {
  const body = process.argv[3];
  console.log(decode(body));
}
