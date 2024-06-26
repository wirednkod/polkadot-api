# Changelog

## Unreleased

## 0.1.1 - 2024-04-12

### Fixed

- [Tx with competing forks problem](https://github.com/polkadot-api/polkadot-api/pull/415)

## 0.1.0 - 2024-04-09

### Changed

- Improved the `bestBlocks$` observable API. For the sake of consistency, the first block of the list will always be the best-block, and the last item of the list will always be the finalized-block. When the best-block and the finalized-block are the same, then the list will contain just one item. Therefore, the observable will never emit an emtpy list.

### Fixed

- The first block on the `finalizedBlockHashes` list of the `initialized` event was not referencing its correct parent when the list had more than one item.
- Added temporary workaround while https://github.com/paritytech/polkadot-sdk/issues/3658 is being fixed

## 0.0.1 - 2024-04-03

### Changed

Initial release
