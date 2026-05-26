import { ElementType } from 'react';
import { AppRole } from '../../../config/roles';

export interface NavItemType {
  id: string;
  title: string;
  icon: ElementType;
  path?: string;
  subModules?: NavItemType[];
  /** Roles permitidos para ver este ítem. Si no se define, es visible para todos. */
  roles?: AppRole[];
}
