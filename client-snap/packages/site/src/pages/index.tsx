import { SetStateAction, useContext, useState } from 'react';
import styled from 'styled-components';
import { MetamaskActions, MetaMaskContext } from '../hooks';
import {
  connectSnap,
  getSnap,
  shouldDisplayReconnectButton,
  sendSignature
} from '../utils';
import {
  ConnectButton,
  ReconnectButton,
  SendFileButton,
  Card,
  InputFileCard,
} from '../components';
import qrcodeParser from "qrcode-parser";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  margin-top: 7.6rem;
  margin-bottom: 7.6rem;
  ${({ theme }) => theme.mediaQueries.small} {
    padding-left: 2.4rem;
    padding-right: 2.4rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
    width: auto;
  }
`;

const Heading = styled.h1`
  margin-top: 0;
  margin-bottom: 2.4rem;
  text-align: center;
`;

const Span = styled.span`
  color: ${(props) => props.theme.colors.primary.default};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: 500;
  margin-top: 0;
  margin-bottom: 0;
  ${({ theme }) => theme.mediaQueries.small} {
    font-size: ${({ theme }) => theme.fontSizes.text};
  }
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 64.8rem;
  width: 100%;
  height: 100%;
  margin-top: 1.5rem;
`;

const Notice = styled.div`
  background-color: ${({ theme }) => theme.colors.background.alternative};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  color: ${({ theme }) => theme.colors.text.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;

  & > * {
    margin: 0;
  }
  ${({ theme }) => theme.mediaQueries.small} {
    margin-top: 1.2rem;
    padding: 1.6rem;
  }
`;

const ErrorMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.error.muted};
  border: 1px solid ${({ theme }) => theme.colors.error.default};
  color: ${({ theme }) => theme.colors.error.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-bottom: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.small} {
    padding: 1.6rem;
    margin-bottom: 1.2rem;
    margin-top: 1.2rem;
    max-width: 100%;
  }
`;

const Index = () => {
  const [state, dispatch] = useContext(MetaMaskContext);
  const [qrCodeImage, setQrCodeImage] = useState();

  const handleConnectClick = async () => {
    try {
      await connectSnap();
      const installedSnap = await getSnap();

      dispatch({
        type: MetamaskActions.SetInstalled,
        payload: installedSnap,
      });
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const handleFileInput = (e: any ) => {
    setQrCodeImage(e.target.files[0]);
  }

  const handleSendQrCode = async () => {7
    try{
      const qrcode = await qrcodeParser(qrCodeImage ? qrCodeImage : '');
      const address = qrcode.split("?",1)[0].split(":",2)[1];
      const message = qrcode.split("=", 3)[2];


      const [ from ] = await window.ethereum.request({
        method: 'eth_requestAccounts'
      }) as string[];

      if(!from){
        throw new Error('Fail to get accounts')
      }

      await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from,
            to: address,
            value: '0x0',
            data: message
          }
        ]
      });
    } catch(e){
      console.log(e);
    }
  }

  return (
    <Container>
      <Heading>
        Welcome to <Span>QR Code System - Client</Span>
      </Heading>
      <Subtitle>
        Send your QR Code through the button below!
      </Subtitle>
      <CardContainer>
        {!state.installedSnap && (
          <Card
            content={{
              title: 'Connect',
              description:
                'Get started by connecting to and installing the QR Code Client snap.',
              button: (
                <ConnectButton
                  onClick={handleConnectClick}
                />
              ),
            }}
          />
        )}
        {shouldDisplayReconnectButton(state.installedSnap) && (
          <Card
            content={{
              title: 'Reconnect',
              description:
                'While connected to a local running snap this button will always be displayed in order to update the snap if a change is made.',
              button: (
                <ReconnectButton
                  onClick={handleConnectClick}
                  disabled={!state.installedSnap}
                />
              ),
            }}
            disabled={!state.installedSnap}
          />
        )}
        <InputFileCard
          content={{
            title: 'Send QR Code',
            description:
              'Send QR Code to decode and make transaction',
            input: (
              <input type="file" onChange={handleFileInput}/>
            ),
            button: (<SendFileButton onClick={handleSendQrCode}/>),

          }}
          disabled={!state.installedSnap}
          fullWidth={
            Boolean(state.installedSnap) &&
            !shouldDisplayReconnectButton(state.installedSnap)
          }
        />
      </CardContainer>
    </Container>
  );
};

export default Index;
