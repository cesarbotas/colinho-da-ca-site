export enum PortePet {
  PEQUENO = "P",
  MEDIO = "M",
  GRANDE = "G"
}

export const PortePetLabel: Record<PortePet, string> = {
  [PortePet.PEQUENO]: "Pequeno",
  [PortePet.MEDIO]: "Médio",
  [PortePet.GRANDE]: "Grande"
};

export const getPorteLabel = (porte: string): string => {
  return PortePetLabel[porte as PortePet] || porte;
};
