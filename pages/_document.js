import { Html, Head, Main, NextScript } from 'next/document';
import { textFont } from '/util/fonts';

export default function Document() {
  return (
    <Html>
      <Head />
      <body className={textFont.className}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
