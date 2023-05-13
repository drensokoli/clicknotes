import { Html, Head, Main, NextScript } from 'next/document'

export default function Document({ }: any) {
  return (
    <Html lang="en">
      <title>ClickNotes</title>
      <meta name="ClickNotes" content="Keeping track of your favourite movies, made easier" />
      <div className='hidden'>
        <script data-name="BMC-Widget" data-cfasync="false" src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js" data-id="drensokoli" data-description="Support me on Buy me a coffee!" data-message="" data-color="#FF813F" data-position="Right" data-x_margin="18" data-y_margin="18" defer></script>
      </div>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.5/flowbite.min.js" defer></script>

      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>

  )
}
