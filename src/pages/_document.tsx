import { Html, Head, Main, NextScript } from 'next/document'

export default function Document({ title }: any) {
  return (
    <Html lang="en">
      <title>MovieNotes</title>
        <meta name="MovieNotes" content="Keeping track of your favourite movies, made easier" />
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
