import {
  loaderGrayIcon,
  DialogBox,
  DialogBoxHeader,
  DialogBoxBody,
  LeanBoxContainer,
  LeanBox,
  Typography,
  Image,
  InputLabel,
  DialogBoxFooter,
  Button,
  LangDisplay,
  etheriumBlueIcon,
} from '@cypherock/cysync-ui';
import React from 'react';

import { addKeyboardEvents } from '~/hooks';
import { selectLanguage, useAppSelector } from '~/store';

import { useAddAccountDialog } from '../../context';

const dataArray = [
  {
    id: '21',
    leftImageSrc: etheriumBlueIcon,
    rightText: '2.35 ETH',
    text: 'Ethereum 1',
  },
  {
    id: '22',
    leftImageSrc: etheriumBlueIcon,
    rightText: '0.77 ETH',
    text: 'Ethereum 2',
  },
  {
    id: '23',
    leftImageSrc: etheriumBlueIcon,
    rightText: '0.08 ETH',
    text: 'Ethereum 3',
  },
];

export const SyncAccountDialog: React.FC = () => {
  const lang = useAppSelector(selectLanguage);

  const sync = lang.strings.addAccount.addAccount.syncAccount.info.dialogBox;
  const { goTo, onNext, onPrevious } = useAddAccountDialog();

  const keyboardActions = {
    ArrowRight: () => {
      goTo(1, 4);
    },
    ArrowLeft: () => {
      onPrevious();
    },
  };

  addKeyboardEvents(keyboardActions);

  const handleNextWithTimeout = () => {
    onNext();
  };

  return (
    <DialogBox width={500}>
      <DialogBoxHeader height={56} width={500}>
        <Typography variant="fineprint" width="100%" color="muted">
          <LangDisplay text={sync.title} />
        </Typography>
      </DialogBoxHeader>
      <DialogBoxBody pt={4} pr={5} pb={4} pl={5}>
        <Image src={loaderGrayIcon} alt="Loader" animate="spin" />
        <Typography variant="h5" $textAlign="center">
          <LangDisplay text={sync.header} />
        </Typography>
        <div>
          <InputLabel mt={4} mr={2} mb={1} display={{ def: 'inline-block' }}>
            {sync.subheader} ({dataArray.length})
          </InputLabel>
          <LeanBoxContainer>
            {dataArray.map(data => (
              <LeanBox
                key={data.id}
                leftImageSrc={data.leftImageSrc}
                rightText={data.rightText}
                text={data.text}
                color="heading"
                textVariant="fineprint"
                rightTextVariant="fineprint"
                rightTextColor="muted"
              />
            ))}
          </LeanBoxContainer>
        </div>
      </DialogBoxBody>
      <DialogBoxFooter>
        <Button variant="secondary" onClick={handleNextWithTimeout}>
          <LangDisplay text={sync.buttonStopSync} />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};