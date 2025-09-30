import React from 'react';
import { Box, Text } from 'ink';

const Logo: React.FC = () => {
  const color = '#ffd700';
  return (
    <Box flexDirection="column" alignItems="flex-start" paddingY={1}>
      <Text bold color={color}>
      ░██         ░██    ░██ ░███     ░███ ░██     ░██
      </Text>
      <Text bold color={color}>
      ░██         ░██    ░██ ░████   ░████ ░██     ░██
      </Text>
      <Text bold color={color}>
      ░██         ░██    ░██ ░██░██ ░██░██ ░██     ░██
      </Text>
      <Text bold color={color}>
      ░██         ░██    ░██ ░██ ░████ ░██ ░██████████
      </Text>
      <Text bold color={color}>
      ░██          ░██  ░██  ░██  ░██  ░██ ░██     ░██
      </Text>
      <Text bold color={color}>
      ░██           ░██░██   ░██       ░██ ░██     ░██
      </Text>
      <Text bold color={color}>
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
