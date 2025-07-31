import { useQuery } from "@tanstack/react-query"

export default function useActorQuery() {
    const { data: Actor } = useQuery({
        queryKey: ["actor"],
        queryFn: () => {
            return getActors()
        },
    })

    return Actor
}
