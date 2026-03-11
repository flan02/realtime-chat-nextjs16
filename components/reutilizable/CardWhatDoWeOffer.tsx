import { Lock, Shield, Zap } from "lucide-react";


const cards = [
  {
    title: "Ephemeral Memory",
    icon: <Zap className="w-6 h-6" />,
    description: "Conversations live exclusively in Redis RAM. When the TTL hits zero, the data is physically purged. Forever."
  },
  {
    title: "Crypto-Lock Access",
    icon: <Lock className="w-6 h-6" />,
    description: "Unlock your session with USDT/ETH. Verified by Alchemy. No emails, no phone numbers, no identities."
  },
  {
    title: "Zero-Knowledge",
    icon: <Shield className="w-6 h-6" />,
    description: "Client-side encryption means even we cant read your messages. Gutout is just the pipe; you hold the key."
  }
];

const CardWhatDoWeOffer = () => {
  return (
    <div id="how" className="grid md:grid-cols-3 gap-12 mt-32 text-left">
      {cards.map((card, index) => (
        <div key={index} className="space-y-4 p-6 border border-red-200/60 dark:border-red-950/40 bg-red-100/30 dark:bg-zinc-950/50 rounded-lg hover:border-red-500/30 transition-colors group">
          <div className="w-12 h-12 bg-red-500/10 flex items-center justify-center rounded-sm text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all">
            {card.icon}
          </div>
          <h3 className="text-xl font-bold text-red-500 dark:text-white">{card.title}</h3>
          <p className="text-zinc-500 leading-relaxed">
            {card.description}
          </p>
        </div>
      ))}
    </div>
  )
}

export default CardWhatDoWeOffer