export function calculateOldWilks(bodyWeight, weightLifted, isFemale) {
  const maleCoeff = [
    -216.0475144,
    16.2606339,
    -0.002388645,
    -0.00113732,
    7.01863e-6,
    -1.291e-8,
  ];
  const femaleCoeff = [
    594.31747775582,
    -27.23842536447,
    0.82112226871,
    -0.00930733913,
    4.731582e-5,
    -9.054e-8,
  ];
  let denominator = isFemale ? femaleCoeff[0] : maleCoeff[0];
  let coeff = isFemale ? femaleCoeff : maleCoeff;
  let minbw = isFemale ? 26.51 : 40;
  let maxbw = isFemale ? 154.53 : 201.9;
  let bw = Math.min(Math.max(bodyWeight, minbw), maxbw);

  for (let i = 1; i < coeff.length; i++) {
    denominator += coeff[i] * Math.pow(bw, i);
  }

  let score = (500 / denominator) * weightLifted;
  return score.toFixed(2);
}

export function calculateNewWilks(bodyWeight, weightLifted, isFemale) {
  const maleCoeff = [
    47.4617885411949,
    8.47206137941125,
    0.073694103462609,
    -1.39583381094385e-3,
    7.07665973070743e-6,
    -1.20804336482315e-8,
  ];
  const femaleCoeff = [
    -125.425539779509,
    13.7121941940668,
    -0.0330725063103405,
    -1.0504000506583e-3,
    9.38773881462799e-6,
    -2.3334613884954e-8,
  ];
  let denominator = isFemale ? femaleCoeff[0] : maleCoeff[0];
  let coeff = isFemale ? femaleCoeff : maleCoeff;
  let minbw = 40;
  let maxbw = isFemale ? 150.95 : 200.95;
  let bw = Math.min(Math.max(bodyWeight, minbw), maxbw);

  for (let i = 1; i < coeff.length; i++) {
    denominator += coeff[i] * Math.pow(bw, i);
  }

  let score = (600 / denominator) * weightLifted;
  return score.toFixed(2);
}

export function calculateDOTS(bodyWeight, weightLifted, isFemale) {
  const maleCoeff = [
    -307.75076,
    24.0900756,
    -0.1918759221,
    0.0007391293,
    -0.000001093,
  ];
  const femaleCoeff = [
    -57.96288,
    13.6175032,
    -0.1126655495,
    0.0005158568,
    -0.0000010706,
  ];

  let denominator = isFemale ? femaleCoeff[0] : maleCoeff[0];
  let coeff = isFemale ? femaleCoeff : maleCoeff;
  let maxbw = isFemale ? 150 : 210;
  let bw = Math.min(Math.max(bodyWeight, 40), maxbw);

  for (let i = 1; i < coeff.length; i++) {
    denominator += coeff[i] * Math.pow(bw, i);
  }

  let score = (500 / denominator) * weightLifted;
  return score.toFixed(2);
}

export function calculateIPF(bodyWeight, weightLifted, isFemale, competition) {
  const maleCoeffCLPL = [310.67, 857.785, 53.216, 147.0835];
  const maleCoeffCLBN = [86.4745, 259.155, 17.5785, 53.122];
  const maleCoeffEQPL = [387.265, 1121.28, 80.6324, 222.4896];
  const maleCoeffEQBN = [133.94, 441.465, 35.3938, 113.0057];

  const femaleCoeffCLPL = [125.1435, 228.03, 34.5246, 86.8301];
  const femaleCoeffCLBN = [25.0485, 43.848, 6.7172, 13.952];
  const femaleCoeffEQPL = [176.58, 373.315, 48.4534, 110.0103];
  const femaleCoeffEQBN = [49.106, 124.209, 23.199, 67.4926];

  let coeff;
  if (isFemale) {
    switch (competition) {
      case "CLBN":
        coeff = femaleCoeffCLBN;
        break;
      case "EQPL":
        coeff = femaleCoeffEQPL;
        break;
      case "EQBN":
        coeff = femaleCoeffEQBN;
        break;
      case "CLPL":
      default:
        coeff = femaleCoeffCLPL;
        break;
    }
  } else {
    switch (competition) {
      case "CLBN":
        coeff = maleCoeffCLBN;
        break;
      case "EQPL":
        coeff = maleCoeffEQPL;
        break;
      case "EQBN":
        coeff = maleCoeffEQBN;
        break;
      case "CLPL":
      default:
        coeff = maleCoeffCLPL;
        break;
    }
  }
  if (bodyWeight < 40) return "0.00";

  let lnbw = Math.log(bodyWeight);
  let score =
    500 +
    100 *
      ((weightLifted - (coeff[0] * lnbw - coeff[1])) /
        (coeff[2] * lnbw - coeff[3]));
  return score < 0 ? "0.00" : score.toFixed(2);
}

export function calculateIPFGL(bodyWeight, weightLifted, isFemale, competition) {
  const maleCoeffCLPL = [1199.72839, 1025.18162, 0.00921];
  const maleCoeffCLBN = [320.98041, 281.40258, 0.01008];
  const maleCoeffEQPL = [1236.25115, 1449.21864, 0.01644];
  const maleCoeffEQBN = [381.22073, 733.79378, 0.02398];

  const femaleCoeffCLPL = [610.32796, 1045.59282, 0.03048];
  const femaleCoeffCLBN = [142.40398, 442.52671, 0.04724];
  const femaleCoeffEQPL = [758.63878, 949.31382, 0.02435];
  const femaleCoeffEQBN = [221.82209, 357.00377, 0.02937];

  let coeff;
  if (isFemale) {
    switch (competition) {
      case "CLBN":
        coeff = femaleCoeffCLBN;
        break;
      case "EQPL":
        coeff = femaleCoeffEQPL;
        break;
      case "EQBN":
        coeff = femaleCoeffEQBN;
        break;
      case "CLPL":
      default:
        coeff = femaleCoeffCLPL;
        break;
    }
  } else {
    switch (competition) {
      case "CLBN":
        coeff = maleCoeffCLBN;
        break;
      case "EQPL":
        coeff = maleCoeffEQPL;
        break;
      case "EQBN":
        coeff = maleCoeffEQBN;
        break;
      case "CLPL":
      default:
        coeff = maleCoeffCLPL;
        break;
    }
  }
  if (bodyWeight < 35) return "0.00";

  let power = -coeff[2] * bodyWeight;
  let score =
    weightLifted * (100 / (coeff[0] - coeff[1] * Math.pow(Math.E, power)));
  return score < 0 ? "0.00" : score.toFixed(2);
}
