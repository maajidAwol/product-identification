import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'
import { Product } from './ProductIdentifier'

interface ResultsTableProps {
  products: Product[]
}

export default function ResultsTable({ products }: ResultsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product Name</TableHead>
          <TableHead>Brand</TableHead>
          <TableHead>Model</TableHead>
          <TableHead>Size</TableHead>
          <TableHead>Average Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product, index) => (
          <TableRow key={index}>
            <TableCell>{product.name}</TableCell>
            <TableCell>{product.brand}</TableCell>
            <TableCell>{product.model}</TableCell>
            <TableCell>{product.size}</TableCell>
            <TableCell>${product.averagePrice.toFixed(2)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

