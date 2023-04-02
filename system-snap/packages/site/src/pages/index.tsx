import { SetStateAction, useContext, useState } from 'react';
import styled from 'styled-components';
import { MetamaskActions, MetaMaskContext } from '../hooks';
import {
  connectSnap,
  getSnap,
  shouldDisplayReconnectButton,
  generateQRcode
} from '../utils';
import {
  ConnectButton,
  ReconnectButton,
  GenerateQRCodeButton,
  Card,
  QrCodeCard,
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

      const contract = "ugabugaugabuga"
      const code = 'ethereum:'+contract+'?amount=0&message='+message;
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
        {/* {state.error && (
          <ErrorMessage>
            <b>An error happened:</b> {state.error.message}
          </ErrorMessage>
        )} */}
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
