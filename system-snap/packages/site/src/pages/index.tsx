import { SetStateAction, useContext, useState } from 'react';
import styled from 'styled-components';
import { MetamaskActions, MetaMaskContext } from '../hooks';
import {
  connectSnap,
  getSnap,
  shouldDisplayReconnectButton,
} from '../utils';
import {
  ConnectButton,
  ReconnectButton,
  GenerateQRCodeButton,
  Card,
} from '../components';

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

const Index = () => {
  const [state, dispatch] = useContext(MetaMaskContext);
  const [qrCodeGenerated, setQrCodeGenerated] = useState(false);
  const [qrCodeImageSource, setQrCodeImageSource] = useState('');
  const [message, setMessage] = useState('');


  const handleConnectClick = async () => {
    try {
      setQrCodeGenerated(false);
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

  const handleTextBoxChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setMessage(event.target.value);
  }

  const handleGenerateQRCodeClick = async () => {
    try {
      const QRCode = require('qrcode');

      const contract = "0x2afd779a65858CFf728eEc28E38989d45207Df04"
      //todo
      //Fix this. Now only works for 32bits message e.g 0x7b == 123
      const code = 'ethereum:'+contract+'?amount=0&message=0x3bc862c700000000000000000000000000000000000000000000000000000000000000'+message;
      setQrCodeGenerated(true);

      QRCode.toString(code, {
        errorCorrectionLevel: 'H',
        type: 'svg'
      }, (err: any, data: any) => {
        if (err) throw err;
        let blob = new Blob([data], {type: 'image/svg+xml'});
        setQrCodeImageSource(URL.createObjectURL(blob));
      });
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  return (
    <Container>
      <Heading>
        Welcome to <Span>QR Code System - System</Span>
      </Heading>
      <Subtitle>
        Generate your QR Code with the button below!
      </Subtitle>
      <CardContainer>
        {!state.installedSnap && (
          <Card
            content={{
              title: 'Connect',
              description:
                'Get started by connecting to and installing the QR Code System snap.',
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
        <Card
          content={{
            title: 'Generate QR Code',
            description:
              'Generate and display QR Code to sign contracts.',
            button: (
              <GenerateQRCodeButton
                onClick={handleGenerateQRCodeClick}
                disabled={!state.installedSnap}
              />
            ),
          }}
          disabled={!state.installedSnap}
          fullWidth={
            Boolean(state.installedSnap) &&
            !shouldDisplayReconnectButton(state.installedSnap)
          }
        />
        <label>
          Message:
          <input type="text" onChange={handleTextBoxChange} />
        </label>
      </CardContainer>
      {qrCodeGenerated && (
      <CardContainer>
        <img src={qrCodeImageSource} />
      </CardContainer>
      )}
    </Container>
  );
};

export default Index;
