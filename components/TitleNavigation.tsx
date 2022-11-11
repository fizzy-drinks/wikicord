import styled from "styled-components";

const TitleNavigation = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  @media (max-width: 1024px) {
    flex-direction: column-reverse;
    align-items: stretch;
    margin-bottom: 1rem;
  }
`;

const TitleNavigationMenu = styled.div`
  font-size: 0.9em;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

export default TitleNavigation;

export { TitleNavigationMenu };
