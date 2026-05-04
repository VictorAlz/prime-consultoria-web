import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

interface CaseCardProps {
  title: string;
  category: string;
  description: string;
  results: string;
  image?: string;
}

const CaseCard = ({ title, category, description, results, image }: CaseCardProps) => {
  return (
    <Card className="group overflow-hidden border-border hover:border-primary/50 transition-all duration-300 card-hover">
      <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 relative overflow-hidden">
        {image && (
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
        <Badge className="absolute top-4 left-4 bg-highlight text-highlight-foreground">
          {category}
        </Badge>
      </div>

      <CardContent className="p-6 space-y-4">
        <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground line-clamp-3">{description}</p>

        <div className="pt-4 border-t border-border">
          <div className="text-sm font-semibold text-accent mb-2">
            Resultados Alcançados
          </div>
          <p className="text-sm text-muted-foreground">{results}</p>
        </div>

      </CardContent>
    </Card>
  );
};

export default CaseCard;
