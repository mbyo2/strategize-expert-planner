import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { File as FileIcon, FilePdf, FileText, FilePresentation, FileSpreadsheet, FileImage } from 'lucide-react';
import { toast } from 'sonner';

// Define the schema for the form
const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().optional(),
  url: z.string().url({ message: "Please enter a valid URL." }),
  type: z.string().optional(),
})

interface Resource {
  id: string;
  title: string;
  description?: string;
  url: string;
  type?: string;
}

const Resources: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = React.useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      url: "",
      type: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Here, you would typically handle the form submission,
    // such as sending the data to an API.
    console.log(values)
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      ),
    })
  }

  useEffect(() => {
    // Simulate loading resources from an API
    setTimeout(() => {
      setResources([
        {
          id: '1',
          title: 'Strategic Planning Guide',
          description: 'A comprehensive guide to strategic planning.',
          url: 'https://example.com/strategic-planning-guide.pdf',
          type: 'pdf',
        },
        {
          id: '2',
          title: 'Market Analysis Report 2024',
          description: 'Detailed analysis of the current market trends.',
          url: 'https://example.com/market-analysis-2024.pdf',
          type: 'pdf',
        },
        {
          id: '3',
          title: 'Team Alignment Workshop Slides',
          description: 'Slides from the team alignment workshop.',
          url: 'https://example.com/team-alignment-slides.ppt',
          type: 'ppt',
        },
        {
          id: '4',
          title: 'Competitive Analysis Spreadsheet',
          description: 'A spreadsheet comparing our company with competitors.',
          url: 'https://example.com/competitive-analysis.xlsx',
          type: 'xlsx',
        },
        {
          id: '5',
          title: 'New Product Launch Strategy',
          description: 'A document outlining the strategy for launching our new product.',
          url: 'https://example.com/new-product-launch-strategy.doc',
          type: 'doc',
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  // Function to determine the icon based on the file type
  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <FilePdf className="h-5 w-5" />;
      case 'doc':
      case 'docx':
        return <FileText className="h-5 w-5" />;
      case 'ppt':
      case 'pptx':
        return <FilePresentation className="h-5 w-5" />;
      case 'xls':
      case 'xlsx':
      case 'csv':
        return <FileSpreadsheet className="h-5 w-5" />;
      case 'img':
      case 'png':
      case 'jpg':
      case 'jpeg':
        return <FileImage className="h-5 w-5" />;
      default:
        return <FileIcon className="h-5 w-5" />;
    }
  };

  return (
    <PageLayout
      title="Resources"
      subtitle="Access valuable resources to support your strategic initiatives"
    >
      <div className="md:flex justify-between items-center mb-4">
        <div />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Add Resource</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Resource</DialogTitle>
              <DialogDescription>
                Add a new resource to the list.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Resource Title" {...field} />
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
                        <Textarea
                          placeholder="Resource Description"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL</FormLabel>
                      <FormControl>
                        <Input placeholder="Resource URL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button type="submit">Add Resource</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Resources</CardTitle>
          <CardDescription>
            Browse the resources to find valuable information and tools.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>URL</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Loading resources...
                  </TableCell>
                </TableRow>
              ) : resources.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No resources available.
                  </TableCell>
                </TableRow>
              ) : (
                resources.map((resource) => (
                  <TableRow key={resource.id}>
                    <TableCell className="font-medium">{resource.title}</TableCell>
                    <TableCell>{resource.description}</TableCell>
                    <TableCell className="flex items-center">
                      {getTypeIcon(resource.type || '')}
                    </TableCell>
                    <TableCell>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        View
                      </a>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default Resources;
