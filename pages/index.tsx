import Header from "components/Header";
import WikiParser from "components/WikiParser";
import Cookies from "cookies";
import { GetServerSideProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import getSession from "utils/getSession";

type HomePageProps = {
  isSignedIn: boolean;
};

const HomePage: NextPage<HomePageProps> = ({ isSignedIn }) => {
  return (
    <>
      <NextSeo
        title="Wikicord, the Discord encyclopedia"
        description="Wikicord lets you run a private wiki for your Discord server."
      />
      <Header isSignedIn={isSignedIn} />
      <main>
        <h1>Welcome to Wikicord</h1>
        <p>Run a private wiki for your Discord server!</p>
        <WikiParser>
          {`
# How it works

First, you sign in with your Discord account so we
know which servers&apos; wikis you can access. Afterwards, you&apos;ll
see a list of wikis&mdash;one for each server. Select whichever one
you want to check out and have fun!

## Who can access my wiki?

Anyone with access to your server will also have access to your wiki. This means
they can view the pages, changelog and also edit things themselves, so it may not
be suited for more controlled environments.

## How do I create my own wiki?

Simply sign in, click on your server and edit the home page. If you want to create
new pages out of the blue, we suggest adding a link to the non-existant page,
clicking it, and editing the blank page that comes up. You can also navigate to
pages that don't exist yet by typing them into the URL!

# Wiki syntax

We use Markdown with a few plugins to render our pages. That means everyone gets
access to basic formatting plus a few interesting things such as code highlighting,
tables, Wikimedia-style links between articles and automatic table of contents
generation.

## The basics

### Paragraphs

Text is composed in paragraphs. To create a new paragraph, simply add two line breaks.
A single line break is ignored, so you can use it to organise your text.

~~~md
Lorem ipsum, give a dog a bone

New paragraph!
~~~

### Headings

Titles are marked with \`#\` characters at the beginning of a line. The more \`#\`s,
the deeper the title nesting goes.

~~~md
# I am a title

## I am a sub-heading

### I am nested even further!

#### How far can we go?
~~~

This gets automatically reflected in the article's table of contents, so it's your
main tool for organisation.

### Basic formatting

Text can be formatted in **bold**, *italics* and even ***both of them combined***~.

~~~md
Text can be formatted in **bold**, *italics* and even ***both of them combined***~.
~~~

### Links

Basic links can be done in Markdown like [this](https://www.youtube.com/watch?v=GtL1huin9EE).

~~~md
Basic links can be done in Markdown like [this](https://www.youtube.com/watch?v=GtL1huin9EE).
~~~

#### Easier links between articles

You can add links between articles with the same syntax as Wikimedia sites, by wrapping
words in \`[[double brackets]]\`.

## Images

Images have a syntax that's similar to links, but starts with an exclamation mark.

![Remember this?](/windows-xp-field.jpg)

~~~md
![Remember this?](/windows-xp-field.jpg)
~~~

## Preformatted text & code

~~~
To write preformatted text,
  start a line with three tildes (~~~).
To stop preformatted text,
  add another line with three tildes.
  
      It also works with backticks (\`\`\`).
~~~

~~~js
// To write code with highlighting, write a file extension after the tildes (~~~md, ~~~js, etc).

const foo = (bar: string) => [20, 'baz'];
~~~


## GFM

[GFM](https://github.github.com/gfm/) is enabled, so you can make tables and checklists.

### Tables

Heading | Heading | Heading
--------|---------|--------
Cell    | Cell    | Cell
Cell    | Cell    | Cell
Cell    | Cell    | Cell

~~~md
Heading | Heading | Heading
--------|---------|--------
Cell    | Cell    | Cell
Cell    | Cell    | Cell
Cell    | Cell    | Cell
~~~

### Checklists

- [x] Item 1
- [x] Item 2
- [ ] Item 3
- [ ] Item 4
- [x] Item 5, done early!

~~~md
- [x] Item 1
- [x] Item 2
- [ ] Item 3
- [ ] Item 4
- [x] Item 5, done early!
~~~

### Strikethrough

~This was scrapped at some point. Why din't you delete it?~

~~~md
~This was scrapped at some point. Why din't you delete it?~
~~~
`}
        </WikiParser>
      </main>
    </>
  );
};

export default HomePage;

export const getServerSideProps: GetServerSideProps<HomePageProps> = async ({
  req,
  res,
}) => {
  const cookies = new Cookies(req, res);
  const session = await getSession(cookies);

  return {
    props: {
      isSignedIn: !!session,
    },
  };
};
