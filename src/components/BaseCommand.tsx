import React from 'react';
import Logo from './Logo.js';
import { Box, Text } from 'ink';
import { CLI_NAME, PRIMARY_COLOR } from '../utils/constants.js';

const BaseUI: React.FC = () => {
  return (
    <>
      <Logo />
      <Box marginBottom={1}>
        <Text>Try to make a query with</Text>
        <Text bold color={PRIMARY_COLOR}>
          {` \`${CLI_NAME} search\` `}
        </Text>
        <Text>or</Text>
        <Text bold color={PRIMARY_COLOR}>
          {` \`${CLI_NAME} help\` `}
        </Text>
        <Text>to get more information.</Text>
      </Box>
    </>
  );
};

export const showBaseUI = (): React.ReactNode => <BaseUI />;
