export type PlanDetailsProps = {
  maxServices: number;
}

export type PlanProps = {
  BASIC: PlanDetailsProps;
  PROFESSIONAL: PlanDetailsProps;
}

export const PLANS: PlanProps = {
  BASIC: {
    maxServices: 3,
  },
  PROFESSIONAL: {
    maxServices: 40,
  }
}

export const subscriptionPlans = [
  {
    id: "BASIC",
    name: "Basic",
    description: "Perfeito para clinicas menores",
    oldProce: "R$ 97,90",
    price: "R$ 27,90",
    features: [
      `Até ${PLANS["BASIC"].maxServices} serviços`,
      "Agendamentos ilimitados",
      "Suporte",
      "Relatorios"
    ]
  },
  {
    id: "PROFESSIONAL",
    name: "Profissional",
    description: "Ideal para clinicas grandes",
    oldProce: "R$ 197,90",
    price: "R$ 97,90",
    features: [
      `Até ${PLANS["PROFESSIONAL"].maxServices} serviços`,
      "Agendamentos ilimitados",
      "Suporte prioritario",
      "Relatorios avançados"
    ]
  },
]