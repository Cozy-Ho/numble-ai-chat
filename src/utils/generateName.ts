type InputNameType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

const genName = (input: InputNameType) => {
  //
  switch (input) {
    case 0:
      return "rkdwn";
    case 1:
      return "cat";
    case 2:
      return "dog";
    case 3:
      return "snake";
    case 4:
      return "duck";
    case 5:
      return "space";
    case 6:
      return "pig";
    case 7:
      return "brave";
  }
};

export { genName };
export type { InputNameType };
