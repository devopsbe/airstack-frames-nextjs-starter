/** @jsxImportSource @airstack/frog/jsx */
import { TextInput, Button, Frog } from "@airstack/frog";
import { handle } from "@airstack/frog/next";
import { devtools } from "@airstack/frog/dev";
import { serveStatic } from "@airstack/frog/serve-static";

const app = new Frog({
  apiKey: process.env.AIRSTACK_API_KEY as string,
  basePath: '/api',
})

app.frame('/', (c) => {
  return c.res({
    action: '/picker',
    image: `${process.env.NEXT_PUBLIC_SITE_URL}/born.jpg`,
    intents: [
      <Button value="A">Trump</Button>,
      <Button value="B">Biden</Button>,
    ],
  })
})

app.frame('/picker', (c) => {
  const { buttonValue, verified } = c

  if (verified) {
    if (buttonValue === 'A') {
      return c.res({
        action: '/meme/a',
        image: `${process.env.NEXT_PUBLIC_SITE_URL}/meme/a`,
        imageAspectRatio: '1:1',
        intents: [
          <TextInput placeholder="Text" />,
          <Button value="generate">Generate</Button>,
        ],
      })
    }
  

    return c.res({
      action: '/meme/b',
      image: `${process.env.NEXT_PUBLIC_SITE_URL}/meme/b`,
      imageAspectRatio: '1:1',
      intents: [
        <TextInput placeholder="Text" />,
        <Button value="generate">Generate</Button>,
      ],
    })
  }

  return c.res({
    action: '/',
    image: (
      <div style= {{ color: 'white', display: 'flex', fontSize: 60}}>
       INVALID USER
      </div>
    ),
    intents: [<Button>Try Again</Button>],
  })
})


app.frame('/meme/:id', (c) => {
  const id = c.req.param('id')

  const { frameData, verified } = c
  
  const { inputText = '' } = frameData || {}

  const newSearchParams = new URLSearchParams({
    text: inputText,
  })
      
  if (verified) {
    if (id === 'a') {
      return c.res({
        action:'/',
        image: `${process.env.NEXT_PUBLIC_SITE_URL}/meme/a?${newSearchParams}`,
        imageAspectRatio: '1:1',
        intents: [<Button>Start Over 💊</Button>],
      })
    }

    return c.res({
      action:'/',
      image: `${process.env.NEXT_PUBLIC_SITE_URL}/meme/b?${newSearchParams}`,
      imageAspectRatio: '1:1',
      intents: [<Button>Start Over 💊</Button>], 
    })
  }

  return c.res({
    action: '/',
    image: (
      <div style={{ color: 'white', display: 'flex', fontSize: 60 }}>
        Invalid User
      </div>
    ),
    intents: [<Button>Try Again 🔄</Button>],
  })
})

 devtools(app, { serveStatic })

export const GET = handle(app);
export const POST = handle(app);
