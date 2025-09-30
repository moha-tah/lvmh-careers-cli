import chalk from 'chalk';

import { OfferHitDTO } from '../api/dtos/outputs/offer-hit.dto.js';
import { PRIMARY_COLOR } from './constants.js';

export function displayOffer(hit: OfferHitDTO, prefix = ''): void {
  console.log(prefix + chalk.white.bold(hit.name));
  console.log(prefix + chalk.gray('🏢 Company: ') + chalk.cyan(hit.maison));
  console.log(
    prefix +
      chalk.gray('📍 Location: ') +
      chalk.green(`${hit.city ?? 'N/A'}, ${hit.country ?? 'N/A'}`)
  );
  console.log(
    prefix + chalk.gray('💼 Function: ') + chalk.magenta(hit.function)
  );
  console.log(
    prefix + chalk.gray('📄 Contract: ') + chalk.yellow(hit.contract)
  );
}

export function displayOffers(hits: OfferHitDTO[]): void {
  hits.forEach((hit, index) => {
    console.log(chalk.hex(PRIMARY_COLOR).bold(`${index + 1}. `));
    displayOffer(hit, '   ');
    console.log();
  });
}

export function displayResultsCount(count: number): void {
  console.log(
    chalk
      .hex(PRIMARY_COLOR)
      .bold(`✨ Found ${count} result${count > 1 ? 's' : ''}`)
  );
}
