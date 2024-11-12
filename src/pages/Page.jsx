import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  background-color: ${({ color }) => color};
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 100px 48px 48px 48px;
  width: 97%;
  box-shadow:
/* Darker shadow for the main page */
    // 0 1px 1px rgba(0,0,0,0.15),
    // 0 10px 0 -5px #eee,
    // 0 10px 1px -4px rgba(0,0,0,0.15),
    // 0 20px 0 -10px #eee,
    // 0 20px 1px -9px rgba(0,0,0,0.15);
     2px 2px 0 #d0d0d0,
    3px 3px 0 #c0c0c0,
    4px 4px 0 #b0b0b0,
    10px 10px 0 #a0a0a0;
  background-image: linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px);
  background-size: 20px 20px;
`;

const Container = styled.nav`
  margin: auto;
  max-width: 640px;
  width: 100%;
`;

const Title = styled.h1`
  font-size: 2.4rem;
  font-weight: 700;
  margin-bottom: 24px;
  text-align: center;
  text-transform: uppercase;

  strong {
    color: rgba(255, 255, 255, 0.9);
    font-weight: 400;
  }
`;

const Description = styled.p`
  font-size: 1.2rem;
  line-height: 1.4;
  margin-bottom: 48px;
  text-align: center;
`;

export function Page({ Page, color, ...rest }) {
  return (
    <Wrapper color={color} {...rest} className="app-page shadow-2xl">
      <Container>
        <Page />
      </Container>
    </Wrapper>
  );
}
