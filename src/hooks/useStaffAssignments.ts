import { useState, useEffect } from 'react';
import { eventoService } from '../features/eventos/services/evento.service';

export const useStaffAssignments = () => {
  const [hasStaffAssignments, setHasStaffAssignments] = useState(false);

  useEffect(() => {
    const check = async () => {
      try {
        const isStaff = await eventoService.tieneAsignacionesStaff();
        setHasStaffAssignments(isStaff);
      } catch {
        setHasStaffAssignments(false);
      }
    };
    check();
  }, []);

  return hasStaffAssignments;
};
