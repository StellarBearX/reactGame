import React from "react";
import styled from "styled-components";
import FarmGrid from "./components/FarmGrid.js";
import Inventory from "./components/Inventory.js";
import Shop from "./components/Shop.js";
// import Menu from "./components/Menu.js";
import StatusBar from "./components/StatusBar.js";
// import SaveLoadPanel from "./components/SaveLoadPanel.js";

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #e6f7e6;
  min-height: 100vh;
  padding: 10px;
`;

const Header = styled.header`
  text-align: center;
  background-color: #a5d6a7;
  padding: 10px 0;
  width: 100%;
  border-radius: 8px;
`;

const Title = styled.h1`
  margin: 0;
  color: #2e7d32;
  font-size: 24px;
`;

const MainSection = styled.main`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 20px;
  width: 90%;
  margin-top: 20px;
`;

const FarmSection = styled.section`
  flex: 2;
  background: #fff;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Sidebar = styled.aside`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Footer = styled.footer`
  margin-top: 30px;
  text-align: center;
  color: #555;
  font-size: 14px;
`;

function App() {
  return (
    <AppContainer>
      <Header>
        <Title>🌾 Cozy Farm Life 🌿</Title>
      </Header>

      <StatusBar />

      <MainSection>
        <FarmSection>
          <FarmGrid />
        </FarmSection>

        <Sidebar>
          <Shop />
          <Inventory />
        </Sidebar>
      </MainSection>

      <Footer>© 2025 Cozy Farm Team</Footer>
    </AppContainer>
  );
}

export default App;
