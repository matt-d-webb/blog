import IndexLayout from '../layouts';
import Wrapper from '../components/Wrapper';
import SiteNav from '../components/header/SiteNav';
import { SiteHeader, outer, inner, SiteMain } from '../styles/shared';
import * as React from 'react';
import { css } from '@emotion/core';
import Chessboard from 'chessboardjsx';
import Stockfish from '../components/Stockfish';
import { PostFullHeader, PostFullTitle, NoImage, PostFull } from '../templates/post';
import { PostFullContent } from '../components/PostContent';
import Footer from '../components/Footer';
import Helmet from 'react-helmet';

const PageTemplate = css`
  .site-main {
    background: #fff;
    padding-bottom: 4vw;
  }
`;

const boardsContainer = {
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center"
};
const boardStyle = {
  borderRadius: "5px",
  boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`
};

const About: React.FunctionComponent = () => (
  <IndexLayout>
    <Helmet>
      <title>About</title>
    </Helmet>
    <Wrapper css={PageTemplate}>
      <header css={[outer, SiteHeader]}>
        <div css={inner}>
          <SiteNav />
        </div>
      </header>
      <main id="site-main" className="site-main" css={[SiteMain, outer]}>
        <article className="post page" css={[PostFull, NoImage]}>
          <PostFullHeader>
            <PostFullTitle>About</PostFullTitle>
          </PostFullHeader>

          <PostFullContent className="post-full-content">
            <div className="post-content">
              <p>:wave: Hello, my name is Matthew Webb. Call me Matt.</p>
              <p>
                I am writing this blog for no other reason than, I have very little better to do with my
                weekends beyond work and drink coffee! :coffee:
              </p>
              <p>
                Try playing my favourite game, Chess:
              </p>
              <div style={boardsContainer}>
                {typeof window !== 'undefined' ?
                  <Stockfish>
                    {({ position, onDrop }: any) => (
                      <Chessboard
                        id="stockfish"
                        position={position}
                        width={320}
                        onDrop={onDrop}
                        boardStyle={boardStyle}
                        orientation="black"
                      />
                    )}
                  </Stockfish> : null
                }

              </div>

            </div>
          </PostFullContent>
        </article>
      </main>
      <Footer />
    </Wrapper>
  </IndexLayout>
);

export default About;
