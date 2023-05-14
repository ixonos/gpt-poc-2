import * as React from 'react';

import { DModelSource } from '../llm.types';
import { findVendorById } from '~/modules/llms/vendors/vendor.registry';


export function SetupSource(props: { source: DModelSource }) {
  const vendor = findVendorById(props.source.vId);
  return vendor?.createSourceSetupComponent(props.source.id) ?? null;
}