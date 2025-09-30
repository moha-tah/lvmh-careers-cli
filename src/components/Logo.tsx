import React from 'react';
import { Box, Text } from 'ink';
import { PRIMARY_COLOR } from '../utils/constants.js';

const Logo: React.FC = () => {
  return (
    <Box flexDirection="column" alignItems="flex-start" paddingY={1}>
      <Text bold color={PRIMARY_COLOR}>
      ░██         ░██    ░██ ░███     ░███ ░██     ░██
      </Text>
      <Text bold color={PRIMARY_COLOR}>
      ░██         ░██    ░██ ░████   ░████ ░██     ░██
      </Text>
      <Text bold color={PRIMARY_COLOR}>
      ░██         ░██    ░██ ░██░██ ░██░██ ░██     ░██
      </Text>
      <Text bold color={PRIMARY_COLOR}>
      ░██         ░██    ░██ ░██ ░████ ░██ ░██████████
      </Text>
      <Text bold color={PRIMARY_COLOR}>
      ░██          ░██  ░██  ░██  ░██  ░██ ░██     ░██
      </Text>
      <Text bold color={PRIMARY_COLOR}>
      ░██           ░██░██   ░██       ░██ ░██     ░██
      </Text>
      <Text bold color={PRIMARY_COLOR}>
      ░██████████    ░███    ░██       ░██ ░██     ░██
      </Text>
      <Box marginTop={1}>
        <Text color="gray">
          Luxury • Fashion • Perfumes • Jewelry
        </Text>
      </Box>
    </Box>
  );
};

export default Logo;
