import { MeleeForm } from "../Forms/form";

const leveltable = {
  1: {
    next: 100,
    numForms: 1,
  },
  2: {
    next: 200,
    numForms: 1,
  },
  3: {
    next: 300,
    numForms: 2,
  },
  4: {
    next: 400,
    numForms: 2,
  },
  5: {
    next: 500,
    numForms: 2,
  },
};

export class MeleeSequence {
  name: string = "";
  forms: MeleeForm[] = [];
  numForms: number = 1;
  level: number = 1;
  experience: number = 0;
  opacity: number = 1;

  constructor(name: string) {
    this.name = name;
  }

  runSequence(): void {}

  changeForm(index: number, form: MeleeForm): void {}
}
