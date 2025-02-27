import React from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { ChevronsUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";

export type FormSchemaType = z.infer<typeof FormSchema>;

const FormSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  description: z.string().min(3, {
    message: "Description must be at least 3 characters.",
  }),
  deadline: z.string(),
  skills: z.array(z.string()).optional(), 
});


interface TicketFormProps {
  onSubmit: (values: z.infer<typeof FormSchema>) => void;
}

const TicketForm: React.FC<TicketFormProps> = ({ onSubmit }) => {
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
      deadline: "", // Default deadline to empty string
      skills: [],
    },
  });
  const [skillsOptions, setSkillsOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [loadingSkills, setLoadingSkills] = useState<boolean>(true);
  const [errorSkills, setErrorSkills] = useState<string | null>(null);

  useEffect(() => {
    const fetchSkills = async () => {
      setLoadingSkills(true);
      setErrorSkills(null);
      try {
        const response = await fetch("/api/team-members");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const teamMembers = (await response.json()) as {
          id: string;
          name: string;
          role: string;
        }[];
        const options = teamMembers.map((member) => ({
          label: `${member.name} (${member.role})`,
          value: member.id, // Use member.id as the value
        }));
        setSkillsOptions(options);
      } catch (error: unknown) {
        setErrorSkills((error as Error).message || "Could not fetch skills");
        setSkillsOptions([]);
      } finally {
        setLoadingSkills(false);
      }
    };


    fetchSkills();
  }, []);

  function handleSubmit(values: FormSchemaType) {
    console.log("Form values on submit:", values); 
    onSubmit(values);
  }

  if (loadingSkills) {
    return <div>Loading skills...</div>;
  }

  if (errorSkills) {
    return <div>Error loading skills: {errorSkills}</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* Title and Description FormFields */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Ticket Title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Ticket Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="deadline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deadline</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  min={new Date().toISOString().slice(0, 10)}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="skills"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Skills</FormLabel>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={false}
                      className="w-full justify-between"
                    >
                      {field.value ? (
                        skillsOptions.find((option) => option.value === field.value)?.label
                      ) : (
                        <span>Select skill</span>
                      )}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[200px]">
                  {skillsOptions.map((skill) => ( // Removed index, using skill directly as key is not reliable if not unique, but for now let's keep it simple, if issues arise, we can use index again or generate unique key if needed.
                    <DropdownMenuItem
                      key={skill.value} // Use skill.value (which is now member.id) as key - better if IDs are unique
                      onSelect={() => {
                        console.log(`Selected skill value (ID): ${skill.value}, Current field value: ${field.value}`);
                        field.onChange(skill.value);
                        console.log(`Field value after onChange (ID): ${field.value}`);
                      }}
                    >
                      <span>{skill.label}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Create Ticket</Button>
      </form>
    </Form>
  );
};

export default TicketForm;