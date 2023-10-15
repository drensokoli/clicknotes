import { Html, Head, Main, NextScript } from 'next/document'
import { Analytics } from '@vercel/analytics/react';
import { useEffect } from 'react';

export default function Document({ }: any) {
  useEffect(() => {
    function signalGooglefcPresent() {
      if (!(window.frames as any)['googlefcPresent']) {
        if (document.body) {
          const iframe = document.createElement('iframe');
          iframe.setAttribute('style', 'width: 0; height: 0; border: none; z-index: -1000; left: -1000px; top: -1000px; display: none;');
          iframe.name = 'googlefcPresent';
          document.body.appendChild(iframe);
        } else {
          setTimeout(signalGooglefcPresent, 0);
        }
      }
    }
    signalGooglefcPresent();
  }, []);

  return (
    <Html lang="en">
      <title>ClickNotes</title>
      <meta name="ClickNotes" content="Keeping track of your favourite movies, made easier" />
      {/* <div className='hidden'>
        <script data-name="BMC-Widget" data-cfasync="false" src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js" data-id="drensokoli" data-description="Support me on Buy me a coffee!" data-message="" data-color="#FF813F" data-position="Right" data-x_margin="18" data-y_margin="18" defer></script>
      </div> */}
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3464540666338005" crossOrigin="anonymous"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.5/flowbite.min.js" defer></script>

      <Head>
        <script async src="https://fundingchoicesmessages.google.com/i/pub-3464540666338005?ers=1" nonce="DV0Ctwps1CcM2EgF8YfUPg"></script>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3464540666338005" crossOrigin="anonymous"></script>
        <meta name="google-site-verification" content="FcZHO-KLXtlpoG78-JTPwWnFRiQ3APV-sm3VJXlLb1E" />
        <meta name="google-adsense-account" content="ca-pub-3464540666338005" />
      </Head>
      <body>
        <Main />
        <NextScript />
        <Analytics />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3464540666338005" crossOrigin="anonymous"></script>
      </body>
    </Html>
  )
}
