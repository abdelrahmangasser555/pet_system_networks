export interface Animal {
  name: string;
  url: string;
  description: string;
  default_weight: number;
  emoji: string;
}

export const animals_links: Animal[] = [
  {
    name: "cat",
    url: "https://stock.adobe.com/search?k=cat+cartoon",
    description: "a lovely cat",
    default_weight: 0.8,
    emoji: "🐱",
  },
  {
    name: "dog",
    url: "https://stock.adobe.com/search?k=dog+cartoon",
    description: "a lovely dog",
    default_weight: 0.5,
    emoji: "🐶",
  },
  {
    name: "rabbit",
    url: "https://stock.adobe.com/search?k=rabbit+cartoon",
    description: "a lovely rabbit",
    default_weight: 0.5,
    emoji: "🐰",
  },
  {
    name: "hamster",
    url: "https://stock.adobe.com/search?k=hamster+cartoon",
    description: "a lovely hamster",
    default_weight: 0.1,
    emoji: "🐹",
  },
  {
    name: "bird",
    url: "https://stock.adobe.com/search?k=bird+cartoon",
    description: "a lovely bird",
    default_weight: 0.5,
    emoji: "🐦",
  },
  {
    name: "fish",
    url: "https://stock.adobe.com/search?k=fish+cartoon",
    description: "a lovely fish",
    default_weight: 0.2,
    emoji: "🐟",
  },
  {
    name: "turtle",
    url: "https://stock.adobe.com/search?k=turtle+cartoon",
    description: "a lovely turtle",
    default_weight: 0.3,
    emoji: "🐢",
  },
  {
    name: "monkey",
    url: "https://stock.adobe.com/search?k=monkey+cartoon",
    description: "a lovely monkey",
    default_weight: 0.4,
    emoji: "🐒",
  },
  {
    name: "snake",
    url: "https://stock.adobe.com/search?k=snake+cartoon",
    description: "a lovely snake",
    default_weight: 0.3,
    emoji: "🐍",
  },
];
