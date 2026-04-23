export interface Product {
  id: number
  title: string
  price: number
  description: string
  category: string
  rating: { count: number, rate: number }
  image: string
  discount: number
  popular: boolean
}
