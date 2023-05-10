import { Html, Head, Main, NextScript } from 'next/document'

export default function Document({ title }: any) {
  return (
    <Html lang="en">
      <title>MovieNotes</title>
      <meta name="MovieNotes" content="Keeping track of your favourite movies, made easier" />
      <script data-name="BMC-Widget" data-cfasync="false" src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js" data-id="drensokoli" data-description="Support me on Buy me a coffee!" data-message="" data-color="#FF813F" data-position="Right" data-x_margin="18" data-y_margin="18"></script>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
