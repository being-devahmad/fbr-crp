"use client"
import { TableCell, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

export function TableSkeleton() {
    return (
        <>
            {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                    <TableCell>
                        <Skeleton className="h-5 w-[200px]" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-5 w-[80px]" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-5 w-[120px]" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-5 w-[100px]" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-5 w-[80px]" />
                    </TableCell>
                    <TableCell className="text-right">
                        <Skeleton className="h-8 w-8 ml-auto" />
                    </TableCell>
                </TableRow>
            ))}
        </>
    )
}

