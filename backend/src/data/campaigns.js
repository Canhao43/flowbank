import { v4 as uuidv4 } from 'uuid'

// Campanhas ativas para vendas Claro
export const campaigns = [
  {
    id: uuidv4(),
    name: 'Claro Controle Cartão',
    category: 'Plano Móvel',
    description: 'Plano Controle com 20GB + Redes Sociais ilimitadas',
    discount: '30% OFF nos 3 primeiros meses',
    originalPrice: 59.90,
    campaignPrice: 41.93,
    benefit: '20GB de Internet + WhatsApp, Instagram e Facebook ilimitados',
    salesPitch: 'Economize R$ 53,91 nos primeiros 3 meses! Pare de gastar com recargas avulsas e tenha internet garantida o mês todo. Com redes sociais ilimitadas, você nunca fica desconectado.',
    icon: 'mdi-cellphone-check',
    color: 'primary',
    active: true,
    startDate: '2025-11-01',
    endDate: '2025-12-31',
    // Critérios de compatibilidade
    targetProfile: {
      minRechargesPerMonth: 2,        // Faz pelo menos 2 recargas/mês
      minRechargeValue: 20,            // Gasta pelo menos R$ 20 por recarga
      categories: ['Recarga Celular'], // Gasta com recargas
      minScore: 30,                    // Score mínimo Prata
      preferredIncome: 800             // Renda mínima sugerida
    }
  },
  {
    id: uuidv4(),
    name: 'Claro Internet Fixa 500MB',
    category: 'Internet Residencial',
    description: 'Internet ultravelocidade 500MB para sua casa',
    discount: '25% OFF no primeiro ano',
    originalPrice: 99.90,
    campaignPrice: 74.93,
    benefit: '500MB de velocidade + Wi-Fi 6 grátis + Instalação gratuita',
    salesPitch: 'Economize R$ 299,64 no primeiro ano! Para quem já paga Internet, essa é a oportunidade de ter o dobro da velocidade pelo mesmo preço. Trabalha home office? Essa velocidade é ideal!',
    icon: 'mdi-wifi',
    color: 'blue',
    active: true,
    startDate: '2025-11-01',
    endDate: '2025-12-31',
    targetProfile: {
      minScore: 50,                    // Score mínimo Ouro
      categories: ['Moradia'],         // Já paga conta de internet
      hasRent: false,                  // Preferência por quem tem casa própria
      preferredIncome: 2000            // Renda mínima sugerida
    }
  },
  {
    id: uuidv4(),
    name: 'Combo Claro Total',
    category: 'Combo',
    description: 'Internet 300MB + Claro Controle 15GB + Claro TV',
    discount: '40% OFF nos 6 primeiros meses',
    originalPrice: 199.90,
    campaignPrice: 119.94,
    benefit: 'Internet + Celular + TV por um preço único',
    salesPitch: 'Economize R$ 479,76 em 6 meses! Unifique suas contas e pague menos. Quem já usa internet e celular separados pode economizar até R$ 80/mês com o combo.',
    icon: 'mdi-package-variant-closed',
    color: 'purple',
    active: true,
    startDate: '2025-11-15',
    endDate: '2025-12-31',
    targetProfile: {
      minRechargesPerMonth: 2,
      categories: ['Recarga Celular', 'Moradia'],
      minScore: 50,
      preferredIncome: 3000
    }
  },
  {
    id: uuidv4(),
    name: 'Claro Pós-Pago 50GB',
    category: 'Plano Móvel',
    description: 'Pós-pago com 50GB + 5G + Apps ilimitados',
    discount: '20% OFF por 12 meses',
    originalPrice: 119.90,
    campaignPrice: 95.92,
    benefit: '50GB + 5G + Waze, Uber e 99 ilimitados',
    salesPitch: 'Economize R$ 287,76 no ano! Para quem gasta mais de R$ 80/mês com recargas, o pós-pago sai mais barato e você tem muito mais internet. Sem preocupação de ficar sem crédito!',
    icon: 'mdi-cellphone-wireless',
    color: 'orange',
    active: true,
    startDate: '2025-11-01',
    endDate: '2025-12-31',
    targetProfile: {
      minRechargesPerMonth: 3,
      minRechargeValue: 30,
      categories: ['Recarga Celular'],
      minScore: 80,                    // Apenas Diamante
      preferredIncome: 2500
    }
  },
  {
    id: uuidv4(),
    name: 'Claro Controle Light',
    category: 'Plano Móvel',
    description: 'Plano básico com 8GB + WhatsApp ilimitado',
    discount: '35% OFF nos 3 primeiros meses',
    originalPrice: 39.90,
    campaignPrice: 25.94,
    benefit: '8GB de Internet + WhatsApp ilimitado',
    salesPitch: 'Economize R$ 41,88 nos primeiros 3 meses! Ideal para quem usa pouca internet mas precisa estar sempre conectado no WhatsApp. Mais barato que ficar comprando recarga toda semana!',
    icon: 'mdi-cellphone',
    color: 'green',
    active: true,
    startDate: '2025-11-01',
    endDate: '2025-12-31',
    targetProfile: {
      minRechargesPerMonth: 1,
      maxRechargeValue: 25,            // Gasta pouco com recarga
      categories: ['Recarga Celular'],
      minScore: 30,
      maxScore: 49,                    // Foco em Prata
      preferredIncome: 600
    }
  },
  {
    id: uuidv4(),
    name: 'Streaming Combo Premium',
    category: 'Entretenimento',
    description: 'Netflix + Spotify + Amazon Prime por 1 ano',
    discount: '50% OFF no primeiro ano',
    originalPrice: 92.70,
    campaignPrice: 46.35,
    benefit: 'Todos os streamings por metade do preço',
    salesPitch: 'Economize R$ 556,20 no ano! Se você já assina ou pensa em assinar streamings, esse combo tem desconto exclusivo Claro. Entretenimento completo por menos da metade!',
    icon: 'mdi-play-box-multiple',
    color: 'pink',
    active: true,
    startDate: '2025-11-10',
    endDate: '2025-12-25',
    targetProfile: {
      categories: ['Lazer'],           // Já gasta com entretenimento
      hasSubscriptions: true,          // Já tem assinaturas
      minScore: 50,
      preferredIncome: 1500
    }
  }
]

export default campaigns
