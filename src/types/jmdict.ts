export type JMDictProperties = {
  ent_seq: number;
  k_ele: {
    keb: string;
    ke_pri: ['ichi1', 'news1'];
  }[];
  r_ele: {
    reb: string;
  }[];
  sense: {
    pos: string;
    gloss: {
      value: string;
      lang: 'eng';
    }[];
  }[]
}