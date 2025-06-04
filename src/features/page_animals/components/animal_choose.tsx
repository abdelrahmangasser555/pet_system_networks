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
    default_weight: 45,
    emoji: "🐱",
  },
  {
    name: "dog",
    url: "https://stock.adobe.com/search?k=dog+cartoon",
    description: "a lovely dog",
    default_weight: 80,
    emoji: "🐶",
  },
  {
    name: "rabbit",
    url: "https://stock.adobe.com/search?k=rabbit+cartoon",
    description: "a lovely rabbit",
    default_weight: 35,
    emoji: "🐰",
  },
  {
    name: "hamster",
    url: "https://stock.adobe.com/search?k=hamster+cartoon",
    description: "a lovely hamster",
    default_weight: 30,
    emoji: "🐹",
  },
  {
    name: "bird",
    url: "https://stock.adobe.com/search?k=bird+cartoon",
    description: "a lovely bird",
    default_weight: 40,
    emoji: "🐦",
  },
  {
    name: "fish",
    url: "https://stock.adobe.com/search?k=fish+cartoon",
    description: "a lovely fish",
    default_weight: 32,
    emoji: "🐟",
  },
  {
    name: "turtle",
    url: "https://stock.adobe.com/search?k=turtle+cartoon",
    description: "a lovely turtle",
    default_weight: 50,
    emoji: "🐢",
  },
  {
    name: "monkey",
    url: "https://stock.adobe.com/search?k=monkey+cartoon",
    description: "a lovely monkey",
    default_weight: 120,
    emoji: "🐒",
  },
  {
    name: "snake",
    url: "https://stock.adobe.com/search?k=snake+cartoon",
    description: "a lovely snake",
    default_weight: 60,
    emoji: "🐍",
  },
];
