"use client";
/* eslint-disable */
//THis almost took my life, but somehow I prevailed and even added in extra features bro, chai!!!
//On God, I did not die but read enough documentation to make me a better dev

{
  /**
  
  Would have loved to use server actions here bro, but what I am submtting here has a complicated structure, bro can't even think about doing that shit

  react query for the win jhoor
  */
}

{
  /**
   * God abeg, I also have to think of how I'll do an edit page, but that's where reusabliltty comes into play
   */
}
import { useState, useEffect, useRef } from "react";
import {
  defineSchema,
  EditorProvider,
  PortableTextEditable,
  useEditor,
  useEditorSelector,
  keyGenerator,
} from "@portabletext/editor";
import { z } from "zod";
import type {
  PortableTextBlock,
  RenderDecoratorFunction,
  RenderStyleFunction,
  RenderBlockFunction,
  RenderChildFunction,
} from "@portabletext/editor";
import { EventListenerPlugin } from "@portabletext/editor/plugins";
import * as selectors from "@portabletext/editor/selectors";
import { toast } from "react-toastify";
import useSubmitNewArticle from "@/hooks/blogs/useSubmitNewArticle";
import { useSession } from "next-auth/react";
import { sanityFetchWrapper } from "@/sanity/sanityCRUDHandlers";
import { authorQuery } from "@/sanity/queries/author";
import { Author } from "@/sanity/interfaces/author";
import { FaSpinner } from "react-icons/fa6";
import { PortableText } from "@portabletext/react";
// Define the schema
const schemaDefinition = defineSchema({
  decorators: [
    { name: "strong", title: "Strong" },
    { name: "em", title: "Emphasis" },
    { name: "code", title: "Code" },
    { name: "underline", title: "Underline" },
    { name: "strike-through", title: "Strike" },
  ],
  styles: [
    { name: "normal", title: "Normal" },
    { name: "h1", title: "H1" },
    { name: "h2", title: "H2" },
    { name: "h3", title: "H3" },
    { name: "h4", title: "H4" },
    { name: "blockquote", title: "Quote" },
  ],
  lists: [
    { name: "bullet", title: "Bullet" },
    { name: "number", title: "Number" },
  ],
  annotations: [
    {
      name: "link",
      title: "URL",
      type: "object",
      fields: [
        { name: "href", type: "string", title: "URL" },
        { name: "blank", type: "boolean", title: "Open in new tab" },
      ],
    },
  ],
  inlineObjects: [],
  blockObjects: [
    {
      name: "image",
      type: "image",
      fields: [
        { name: "src", type: "string", title: "Image Source" },
        { name: "alt", type: "string", title: "Alternative Text" },
      ],
    },
  ],
});

// Article interface
interface Article {
  _id?: string;
  title: string;

  excerpt: string;
  posterImage?: {
    src: string;
    alt?: string;
  };
  content: PortableTextBlock[];
  publishedAt?: string;
  isDraft: boolean;
  readingTime?: number;
  createdAt: string;
  updatedAt?: string;
}

const calculateReadingTime = (
  blocks: PortableTextBlock[],
  wordsPerMinute = 200
): number => {
  if (!blocks || !Array.isArray(blocks)) return 1;

  let totalWords = 0;

  blocks.forEach((block) => {
    if (
      block._type === "block" &&
      block.children &&
      Array.isArray(block.children)
    ) {
      const text =
        block.children
          .filter((child: any) => child._type === "span" && child.text)
          .map((child: any) => child.text)
          .join(" ") || "";

      const words = text.trim() ? text.trim().split(/\s+/) : [];
      totalWords += words.length;
    } else if (block._type === "image") {
      totalWords += 12;
    }
  });

  return Math.max(1, Math.ceil(totalWords / wordsPerMinute));
};

// Storage utilities
const DRAFT_KEY = "blog-create-draft";

const saveDraftToStorage = (article: Article): boolean => {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(article));
  
    return true;
  } catch (error) {
   
    return false;
  }
};

const loadDraftFromStorage = (): Article | null => {
  try {
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) return JSON.parse(savedDraft);
    return null;
  } catch (error) {

    return null;
  }
};

// Type guard for images I copy am from docs oo
function isImage(props: PortableTextBlock): props is PortableTextBlock & {
  src: string;
  alt?: string;
} {
  return "src" in props;
}

// Simple image block component (no caption editing)
const ImageBlock = ({ value }: { value: any }) => {
  return (
    <div className="my-6 border border-gray-200 rounded-lg overflow-hidden">
      <div className="relative bg-gray-50">
        <img
          src={value.src}
          alt={value.alt || "Image"}
          className="w-full h-auto max-h-96 object-contain"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
            const fallback = target.nextElementSibling as HTMLElement;
            if (fallback) fallback.style.display = "block";
          }}
        />
        <div
          style={{ display: "none" }}
          className="w-full h-48 bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center"
        >
          <div className="text-center text-gray-500">
            <div className="text-4xl mb-2">🖼️</div>
            <div className="text-sm">Failed to load image</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Render functions
const renderStyle: RenderStyleFunction = (props) => {
  const { schemaType, children } = props;

  switch (schemaType.value) {
    case "h1":
      return <h1 className="text-3xl font-bold mb-4">{children}</h1>;
    case "h2":
      return <h2 className="text-2xl font-bold mb-3">{children}</h2>;
    case "h3":
      return <h3 className="text-xl font-bold mb-2">{children}</h3>;
    case "h4":
      return <h4 className="text-lg font-bold mb-2">{children}</h4>;
    case "blockquote":
      return (
        <blockquote className="border-l-4 border-blue-300 pl-4 italic text-gray-700 my-4">
          {children}
        </blockquote>
      );
    default:
      return <p className="mb-4 text-base">{children}</p>;
  }
};

const renderDecorator: RenderDecoratorFunction = (props) => {
  const { value, children } = props;

  switch (value) {
    case "strong":
      return <strong className="font-bold">{children}</strong>;
    case "em":
      return <em className="italic">{children}</em>;
    case "underline":
      return <u className="underline">{children}</u>;
    case "strike-through":
      return <s className="line-through">{children}</s>;
    case "code":
      return (
        <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">
          {children}
        </code>
      );
    default:
      return <>{children}</>;
  }
};

const renderBlock: RenderBlockFunction = (props) => {
  if (props.schemaType.name === "image" && isImage(props.value)) {
    return <ImageBlock value={props.value} />;
  }

  return <div style={{ marginBlockEnd: "0.25em" }}>{props.children}</div>;
};

const renderChild: RenderChildFunction = (props) => {
  return <>{props.children}</>;
};

// Loading component
const EditorSkeleton = () => {
  return (
    <div className="border border-gray-200 rounded-sm overflow-hidden">
      <div className="flex gap-1 p-2 border-b bg-gray-50">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="h-8 w-8 bg-gray-200 rounded animate-pulse"
          ></div>
        ))}
      </div>
      <div className="p-6 space-y-4">
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
        <div className="space-y-2 pt-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-4 bg-gray-100 rounded animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Toolbar components
const StyleButton = ({ styleName }: { styleName: string }) => {
  const editor = useEditor();
  const active = useEditorSelector(editor, selectors.isActiveStyle(styleName));

  const getIcon = () => {
    switch (styleName) {
      case "h1":
        return "H1";
      case "h2":
        return "H2";
      case "h3":
        return "H3";
      case "h4":
        return "H4";
      case "blockquote":
        return "❝";
      default:
        return "P";
    }
  };

  return (
    <button
      type="button"
      onClick={() => {
        editor.send({ type: "style.toggle", style: styleName });
        editor.send({ type: "focus" });
      }}
      className={`px-2 py-1 border rounded transition-colors ${
        active
          ? "bg-blue-500 text-white border-blue-600"
          : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
      }`}
    >
      {getIcon()}
    </button>
  );
};

const DecoratorButton = ({ decoratorName }: { decoratorName: string }) => {
  const editor = useEditor();
  const active = useEditorSelector(
    editor,
    selectors.isActiveDecorator(decoratorName)
  );

  const getIcon = () => {
    switch (decoratorName) {
      case "strong":
        return <strong>B</strong>;
      case "em":
        return <em>I</em>;
      case "underline":
        return <u>U</u>;
      case "strike-through":
        return <s>S</s>;
      case "code":
        return <span className="font-mono">{"<>"}</span>;
      default:
        return decoratorName;
    }
  };

  return (
    <button
      type="button"
      onClick={() => {
        editor.send({ type: "decorator.toggle", decorator: decoratorName });
        editor.send({ type: "focus" });
      }}
      className={`px-2 py-1 border rounded transition-colors ${
        active
          ? "bg-blue-500 text-white border-blue-600"
          : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
      }`}
    >
      {getIcon()}
    </button>
  );
};

const ListButton = ({ listName }: { listName: string }) => {
  const editor = useEditor();
  const active = useEditorSelector(
    editor,
    selectors.isActiveListItem(listName)
  );

  return (
    <button
      type="button"
      onClick={() => {
        editor.send({ type: "list item.toggle", listItem: listName });
        editor.send({ type: "focus" });
      }}
      className={`px-2 py-1 border rounded transition-colors ${
        active
          ? "bg-blue-500 text-white border-blue-600"
          : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
      }`}
    >
      {listName}
    </button>
  );
};

const AnnotationButton = ({ annotationName }: { annotationName: string }) => {
  const editor = useEditor();
  const active = useEditorSelector(
    editor,
    selectors.isActiveAnnotation(annotationName)
  );

  return (
    <button
      type="button"
      onClick={() => {
        if (active) {
          editor.send({
            type: "annotation.remove",
            annotation: { name: annotationName },
          });
        } else {
          editor.send({
            type: "annotation.add",
            annotation: {
              name: annotationName,
              value:
                annotationName === "link"
                  ? { href: "https://example.com" }
                  : {},
            },
          });
        }
        editor.send({ type: "focus" });
      }}
      className={`px-2 py-1 border rounded transition-colors ${
        active
          ? "bg-blue-500 text-white border-blue-600"
          : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
      }`}
    >
      🔗
    </button>
  );
};

// Image upload functionality
const ImageUploadButton = () => {
  const editor = useEditor();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Url = e.target?.result as string;
      const imageKey = keyGenerator();

      const imageData = {
        _type: "image",
        _key: imageKey,
        src: base64Url,
        alt: file.name,
      };

      editor.send({
        type: "insert.block object",
        blockObject: {
          name: "image",
          value: imageData,
        },
        placement: "auto",
      });

    
      editor.send({ type: "focus" });
    };

    reader.onerror = () => {
      alert("Error reading file");
    };

    reader.readAsDataURL(file);
    event.target.value = "";
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: "none" }}
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="px-2 py-1 border rounded bg-green-500 text-white border-green-600 hover:bg-green-600 transition-colors"
        title="Upload Image"
      >
        📷
      </button>
    </>
  );
};

// Poster image upload component
const PosterImageUpload = ({
  posterImage,
  onPosterImageChange,
}: {
  posterImage?: Article["posterImage"];
  onPosterImageChange: (image: Article["posterImage"]) => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Url = e.target?.result as string;
      onPosterImageChange({
        src: base64Url,
        alt: file.name,
      });
    };

    reader.onerror = () => {
      alert("Error reading file");
    };

    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const removePosterImage = () => {
    onPosterImageChange(undefined);
  };

  return (
    <div className="space-y-2">
      <label className="text-xs sm:text-sm font-medium text-gray-600 tracking-wide uppercase">
        Poster Image
      </label>

      {posterImage ? (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="relative">
            <img
              src={posterImage.src}
              alt={posterImage.alt || "Poster image"}
              className="w-full h-48 object-cover"
            />
            <button
              onClick={removePosterImage}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors text-xs"
            >
              ×
            </button>
          </div>
          <div className="p-3 bg-gray-50 border-t">
            <input
              type="text"
              placeholder="Add alt text for accessibility..."
              value={posterImage.alt || ""}
              onChange={(e) =>
                onPosterImageChange({ ...posterImage, alt: e.target.value })
              }
              className="w-full text-sm border border-gray-200 rounded px-2 py-1"
            />
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
        >
          <div className="text-4xl mb-2">🖼️</div>
          <p className="text-sm text-gray-600 mb-1">
            Click to upload poster image
          </p>
          <p className="text-xs text-gray-400">
            Recommended: 1200×630px for best social media display
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: "none" }}
      />
    </div>
  );
};

// Clean toolbar
const CustomToolbar = () => {
  return (
    <div className="flex gap-1 p-2 border-b bg-gray-50">
      {schemaDefinition.styles.map((style) => (
        <StyleButton key={style.name} styleName={style.name} />
      ))}

      <div className="w-px bg-gray-300 mx-2" />

      {schemaDefinition.decorators.map((decorator) => (
        <DecoratorButton key={decorator.name} decoratorName={decorator.name} />
      ))}

      <div className="w-px bg-gray-300 mx-2" />

      {schemaDefinition.lists.map((list) => (
        <ListButton key={list.name} listName={list.name} />
      ))}

      <div className="w-px bg-gray-300 mx-2" />

      {schemaDefinition.annotations.map((annotation) => (
        <AnnotationButton
          key={annotation.name}
          annotationName={annotation.name}
        />
      ))}

      <div className="w-px bg-gray-300 mx-2" />

      <ImageUploadButton  />
    </div>
  );
};

// Preview components
const PreviewComponents = {
  block: {
    normal: ({ children }: any) => (
      <p className="mb-6 text-black leading-8 font-light text-lg tracking-wide">
        {children}
      </p>
    ),
    h1: ({ children }: any) => (
      <h1 className="text-2xl md:text-3xl font-light text-black mb-8 mt-12 leading-tight tracking-tight border-b border-gray-200 pb-4">
        {children}
      </h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-xl md:text-2xl font-light text-black mb-6 mt-10 leading-tight tracking-tight">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-lg md:text-xl font-medium text-black mb-4 mt-8 leading-tight">
        {children}
      </h3>
    ),
    h4: ({ children }: any) => (
      <h4 className="text-base md:text-lg font-medium text-black mb-3 mt-6 leading-tight">
        {children}
      </h4>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="relative my-10 py-4">
        <div className="absolute left-0 top-0 bottom-0 w-px bg-blue-400"></div>
        <div className="pl-8 italic text-lg md:text-xl font-light text-black leading-relaxed">
          {children}
        </div>
      </blockquote>
    ),
  },
  types: {
    image: ({ value }: any) => {
      if (!value.src) return null;
      return (
        <figure className="my-12 md:my-16">
          <div className="relative overflow-hidden bg-gray-100 border border-gray-200 rounded-lg">
            <img
              src={value.src}
              alt={value.alt || ""}
              className="w-full h-auto object-contain max-h-96"
            />
          </div>
        </figure>
      );
    },
  },
  marks: {
    strong: ({ children }: any) => (
      <strong className="font-semibold text-black">{children}</strong>
    ),
    em: ({ children }: any) => (
      <em className="italic font-light">{children}</em>
    ),
    "strike-through": ({ children }: any) => (
      <s className="line-through">{children}</s>
    ),
    link: ({ value, children }: any) => {
      const target = value?.blank ? "_blank" : undefined;
      return (
        <a
          href={value?.href}
          target={target}
          rel={target === "_blank" ? "noopener noreferrer" : undefined}
          className="text-blue-600 hover:text-blue-700 underline underline-offset-2 decoration-1 transition-colors font-medium"
        >
          {children}
        </a>
      );
    },
    code: ({ children }: any) => (
      <code className="bg-gray-100 text-black px-2 py-0.5 text-sm font-mono border border-gray-200">
        {children}
      </code>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="mb-8 space-y-3 ml-0">{children}</ul>
    ),
    number: ({ children }: any) => (
      <ol className="mb-8 space-y-3 ml-0">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }: any) => (
      <li className="text-black font-light text-lg leading-8 flex items-start">
        <span className="inline-block w-1 h-1 bg-blue-400 rounded-full mt-4 mr-6 flex-shrink-0"></span>
        <span className="flex-1">{children}</span>
      </li>
    ),
    number: ({ children }: any) => (
      <li className="text-black font-light text-lg leading-8 list-decimal ml-6">
        {children}
      </li>
    ),
  },
};

const AUTOSAVE_INTERVAL = 5 * 60 * 1000; // 5 minutes

//Doing this I can't call prisma client side
const CreateNewBlog = ({
  databaseAuthorReferenceId,
}: {
  databaseAuthorReferenceId: string;
}) => {
  const [article, setArticle] = useState<Article>({
    title: "",
    excerpt: "",
    content: [
      {
        _type: "block",
        _key: keyGenerator(),
        style: "normal",
        children: [
          {
            _type: "span",
            _key: keyGenerator(),
            text: "Start writing your article here...",
            marks: [],
          },
        ],
      },
    ],
    isDraft: true,
    createdAt: new Date().toISOString(),
  });

  const [authorExtraNeedsforPublishing, setAuthorExtraNeedsforPublishing] =
    useState({
      authorUsername: "",
      authorSanityReferenceId: "",
      authorDatabaseReferenceId: "",
    });

  const { data, status } = useSession();

  //Can't belive I am use effecting to get bro😢 😢 😢 😢
  //Could have decided to use react query to handle this and get caching too, but I just have a gut feeling not to
  useEffect(() => {
    // Don't run if still loading or no session data
    if (status === "loading" || !data?.user?.id) {
      return;
    }

    const getAuthorExtraNeeds = async () => {
      const userId = data.user.id;
      const userName = data.user.userName;

      const getSanityAuthorReferenceId = await sanityFetchWrapper<Author>(
        authorQuery,
        {
          userId: userId,
        }
      );

      //SHould I do this or a promise.all  🤔   🤔   🤔 ?

      const sanityAuthorReferenceId = getSanityAuthorReferenceId._id;
      const authorDatabaseReferenceId = databaseAuthorReferenceId;

      if (userName && sanityAuthorReferenceId) {
        setAuthorExtraNeedsforPublishing({
          authorSanityReferenceId: sanityAuthorReferenceId,
          authorUsername: userName,
          authorDatabaseReferenceId: authorDatabaseReferenceId,
        });
      }
    };

    getAuthorExtraNeeds();
  }, [status, data?.user?.id, data?.user?.userName]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPreview, setIsPreview] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const autosaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitialLoad = useRef(true);

  // Auto-save functionality
  const performAutoSave = (articleToSave: Article) => {
    const success = saveDraftToStorage(articleToSave);
    if (success) {
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
    }
  };

  // Load draft on mount
  useEffect(() => {
    const savedDraft = loadDraftFromStorage();

    if (savedDraft) {
      setArticle(savedDraft);
      setLastSaved(
        savedDraft.updatedAt ? new Date(savedDraft.updatedAt) : null
      );
    }
    isInitialLoad.current = false;

    // Simulate loading time for better UX
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, []); // eslint-disable-next-line react-hooks/exhaustive-deps -- mount only

  // Auto-save timer
  useEffect(() => {
    if (isInitialLoad.current || !hasUnsavedChanges) return;

    if (autosaveTimeoutRef.current) {
      clearTimeout(autosaveTimeoutRef.current);
    }

    autosaveTimeoutRef.current = setTimeout(() => {
      const updatedArticle = {
        ...article,
        updatedAt: new Date().toISOString(),
        readingTime: calculateReadingTime(article.content),
      };
      performAutoSave(updatedArticle);
      setArticle(updatedArticle);
    }, AUTOSAVE_INTERVAL);

    return () => {
      if (autosaveTimeoutRef.current) {
        clearTimeout(autosaveTimeoutRef.current);
      }
    };
  }, [article, hasUnsavedChanges]); // eslint-disable-next-line react-hooks/exhaustive-deps -- mount only

  // Mark changes as unsaved
  useEffect(() => {
    if (!isInitialLoad.current) {
      setHasUnsavedChanges(true);
    }
  }, [article.title, article.excerpt, article.content, article.posterImage]); // eslint-disable-next-line react-hooks/exhaustive-deps -- mount only

  const handleSave = () => {
    const updatedArticle = {
      ...article,
      updatedAt: new Date().toISOString(),
      readingTime: calculateReadingTime(article.content),
      slug: article.title
        ? {
            _type: "slug" as const,
            current: "",
          }
        : undefined,
    };

    saveDraftToStorage(updatedArticle);

    setArticle(updatedArticle);
    setLastSaved(new Date());
    setHasUnsavedChanges(false);
  };

  const handleContentChange = (value: PortableTextBlock[]) => {
    setArticle((prev) => ({
      ...prev,
      content: value || [],
      readingTime: calculateReadingTime(value || []),
    }));
  };

  const handleInputChange =
    (field: keyof Article) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setArticle((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handlePosterImageChange = (posterImage: Article["posterImage"]) => {
    setArticle((prev) => ({ ...prev, posterImage }));
  };

  const formatLastSaved = (date: Date | null): string => {
    if (!date) return "Never";

    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };
  const { submitArticle, isSubmitting, error, isSuccess } =
    useSubmitNewArticle();

  useEffect(() => {
    let toastId: any;

    if (isSubmitting) {
      // Show loading toast when submitting starts
      toastId = toast.loading("Publishing article...", {
        position: "top-center",
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        closeButton: false,
      });
    }

    // Cleanup function
    return () => {
      if (toastId) {
        toast.dismiss(toastId);
      }
    };
  }, [isSubmitting]); // eslint-disable-next-line react-hooks/exhaustive-deps -- mount only

  // Separate useEffect for handling success
  useEffect(() => {
    if (isSuccess) {
      toast.success(
        "Article has been sent to our database, your article would be published after review! 🎉",
        {
          position: "top-center",
          autoClose: 3000,
          closeButton: true,
          pauseOnHover: true,
          draggable: true,
        }
      );

      //reset the whole thing
      setArticle({
        title: "",
        excerpt: "",
        content: [
          {
            _type: "block",
            _key: keyGenerator(),
            style: "normal",
            children: [
              {
                _type: "span",
                _key: keyGenerator(),
                text: "Start writing your article here...",
                marks: [],
              },
            ],
          },
        ],
        isDraft: true,
        createdAt: "",
      });
      //reset local storage for fresh one too biko
      //E remain how I wan implement edit laidis oo, walahi coding hard
      localStorage.removeItem(DRAFT_KEY);

      window.location.reload();
    }
  }, [isSuccess]); // eslint-disable-next-line react-hooks/exhaustive-deps -- mount only

  useEffect(() => {
    if (error) {
      toast.error("Failed to publish article. Please try again.", {
        position: "top-center",
        autoClose: 5000,
        closeButton: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }, [error]); // eslint-disable-next-line react-hooks/exhaustive-deps -- mount only

  const VALIDATION_RULES = {
    title: {
      minLength: 12,
      maxLength: 120,
    },
    excerpt: {
      minLength: 20,
      maxLength: 300,
    },
    content: {
      minWords: 50,
    },
  } as const;

  const validateArticle = (article: Article) => {
    const errors: {
      title?: string;
      excerpt?: string;
      posterImage?: string;
      content?: string;
    } = {};

    // Title validation
    if (!article.title?.trim()) {
      errors.title = "Title is required";
    } else if (article.title.trim().length < VALIDATION_RULES.title.minLength) {
      errors.title = `Title must be at least ${VALIDATION_RULES.title.minLength} characters long`;
    } else if (article.title.trim().length > VALIDATION_RULES.title.maxLength) {
      errors.title = `Title must be no more than ${VALIDATION_RULES.title.maxLength} characters long`;
    }

    // Excerpt validation
    if (!article.excerpt?.trim()) {
      errors.excerpt = "Excerpt is required";
    } else if (
      article.excerpt.trim().length < VALIDATION_RULES.excerpt.minLength
    ) {
      errors.excerpt = `Excerpt must be at least ${VALIDATION_RULES.excerpt.minLength} characters long`;
    } else if (
      article.excerpt.trim().length > VALIDATION_RULES.excerpt.maxLength
    ) {
      errors.excerpt = `Excerpt must be no more than ${VALIDATION_RULES.excerpt.maxLength} characters long`;
    }

    if (!article.posterImage?.src) {
      errors.posterImage = "Poster image is required";
    }

    // Content validation
    const contentWordCount = countWordsInContent(article.content);
    const hasOnlyPlaceholder = isOnlyPlaceholderContent(article.content);

    if (!article.content?.length || hasOnlyPlaceholder) {
      errors.content = "Article content is required";
    } else if (contentWordCount < VALIDATION_RULES.content.minWords) {
      errors.content = `Article needs at least ${VALIDATION_RULES.content.minWords} words (currently ${contentWordCount})`;
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };

  const countWordsInContent = (content: PortableTextBlock[]): number => {
    if (!content || !Array.isArray(content)) return 0;

    let wordCount = 0;

    content.forEach((block) => {
      if (
        block._type === "block" &&
        block.children &&
        Array.isArray(block.children)
      ) {
        const text = block.children
          .filter((child: any) => child._type === "span" && child.text)
          .map((child: any) => child.text)
          .join(" ");

        if (text.trim()) {
          wordCount += text.trim().split(/\s+/).length;
        }
      }
    });

    return wordCount;
  };

  const isOnlyPlaceholderContent = (content: PortableTextBlock[]): boolean => {
    if (!content || content.length === 0) return true;

    const contentText = content
      .filter((block) => block._type === "block" && block.children)
      .flatMap((block) =>
        (block.children as any[])
          .filter((child) => child._type === "span")
          .map((child) => child.text)
      )
      .join("")
      .trim();

    return (
      contentText === "Start writing your article here..." || contentText === ""
    );
  };

  const [validationErrors, setValidationErrors] = useState<{
    title?: string;
    excerpt?: string;
    posterImage?: string;
    content?: string;
  }>({});

  // 5. Real-time validation (add these useEffects)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const { errors } = validateArticle(article);
      setValidationErrors((prev) => ({
        ...prev,
        title: errors.title,
      }));
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [article.title]); // eslint-disable-next-line react-hooks/exhaustive-deps -- mount only

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const { errors } = validateArticle(article);
      setValidationErrors((prev) => ({
        ...prev,
        excerpt: errors.excerpt,
      }));
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [article.excerpt]);

  useEffect(() => {
    const { errors } = validateArticle(article);
    setValidationErrors((prev) => ({
      ...prev,
      posterImage: errors.posterImage,
    }));
  }, [article.posterImage]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const { errors } = validateArticle(article);
      setValidationErrors((prev) => ({
        ...prev,
        content: errors.content,
      }));
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [article.content]); // eslint-disable-next-line react-hooks/exhaustive-deps -- mount only

  const handlePublish = () => {
    if (
      !authorExtraNeedsforPublishing.authorSanityReferenceId ||
      !authorExtraNeedsforPublishing.authorUsername ||
      authorExtraNeedsforPublishing.authorSanityReferenceId === "" ||
      authorExtraNeedsforPublishing.authorUsername === ""
    ) {
      toast.error(
        "Author information is not ready yet. Please try again in a moment."
      );
      return;
    }
    //Wish I could trigger validation some other way but this publishing part is already very complicated, me sef can't explain most of how I peiced it together ooo
    //Chai, I don die, I just want to build, but sometimes I don't know shit and I can't
    //trigger validation here

    const validation = validateArticle(article);

    if (!validation.isValid) {
      // Update all validation errors at once
      setValidationErrors(validation.errors);

      // Show a single, clear error message
      const errorCount = Object.keys(validation.errors).length;
      toast.error(
        `Please fix the ${errorCount} error${errorCount > 1 ? "s" : ""} before publishing`,
        {
          position: "top-center",
          autoClose: 4000,
        }
      );
      return;
    }

    // Clear any existing errors
    setValidationErrors({});

    toast(
      ({ closeToast }) => (
        <div className="flex flex-col space-y-3">
          <p className="text-gray-800 font-medium">
            Are you sure you want to publish this article?
          </p>
          <div className="flex space-x-2">
            <button
              //I for just write one nice hanlde submit function but the sytax don long already so no need abeg
              onClick={() => {
                submitArticle({
                  articleData: article,
                  authorSanityReferenceId:
                    authorExtraNeedsforPublishing.authorSanityReferenceId,
                  authorUsername: authorExtraNeedsforPublishing.authorUsername,
                  authorDatabaseReferenceId:
                    authorExtraNeedsforPublishing.authorDatabaseReferenceId,
                });
                closeToast();
              }}
              className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 font-light text-sm"
            >
              Yes, Publish
            </button>
            <button
              onClick={closeToast}
              className="px-4 py-2 border border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-800 transition-all duration-200 font-light text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: false,
        closeButton: false,
      }
    );
  };

  const isPublishReady =
    authorExtraNeedsforPublishing.authorSanityReferenceId &&
    authorExtraNeedsforPublishing.authorUsername &&
    authorExtraNeedsforPublishing.authorSanityReferenceId !== "" &&
    authorExtraNeedsforPublishing.authorUsername !== "";

  return (
    <>
      <div className="bg-black h-16 mb-2 w-full flex-shrink-0" />

      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-sm z-10">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-6xl">
            <div className="flex items-center justify-between py-3 sm:py-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-6 sm:w-8 h-px bg-blue-400"></div>
                  <span className="text-xs sm:text-sm font-medium text-blue-400 tracking-widest uppercase">
                    Write Article
                  </span>
                  {hasUnsavedChanges && (
                    <div
                      className="w-2 h-2 bg-orange-400 rounded-full"
                      title="Unsaved changes"
                    ></div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2 sm:space-x-3">
                <button
                  onClick={() => setIsPreview(!isPreview)}
                  className="text-black hover:text-blue-500 transition-colors duration-200 font-light tracking-wide text-sm sm:text-base px-2 sm:px-0"
                >
                  {isPreview ? "Edit" : "Preview"}
                </button>
                <button
                  onClick={handleSave}
                  className="px-3 sm:px-6 py-2 border border-gray-300 text-black hover:border-blue-400 hover:text-blue-500 transition-all duration-200 font-light tracking-wide text-sm sm:text-base"
                >
                  Save Draft
                </button>
                <button
                  onClick={handlePublish}
                  disabled={!isPublishReady || isSubmitting}
                  className={`px-3 sm:px-6 py-2 bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200 font-light tracking-wide text-sm sm:text-base shadow-sm ${!isPublishReady || isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center space-x-2">
                      <FaSpinner size={20} className="animate-spin " />
                      <p>Publishing</p>
                    </span>
                  ) : (
                    "Publish Article"
                  )}
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-4xl py-8 sm:py-12">
          {!isPreview ? (
            /* Editor Mode */
            <div className="space-y-8 sm:space-y-12">
              {/* Article Meta */}
              <div className="space-y-6 sm:space-y-8">
                {/* Title */}
                <div className="flex flex-col gap-1.5">
                  <input
                    type="text"
                    value={article.title}
                    onChange={handleInputChange("title")}
                    placeholder="Enter your article title..."
                    className={`w-full text-2xl sm:text-3xl md:text-4xl font-light text-black placeholder-gray-400 border-none outline-none bg-transparent leading-tight tracking-tight ${
                      validationErrors.title ? "border-b-2 border-red-300" : ""
                    }`}
                  />
                  {validationErrors.title && (
                    <p className="text-red-500 text-sm font-medium">
                      {validationErrors.title}
                    </p>
                  )}
                </div>

                {/* Excerpt */}
                <div className="flex flex-col gap-1">
                  <textarea
                    value={article.excerpt}
                    onChange={handleInputChange("excerpt")}
                    placeholder="Brief description of the post (for previews and SEO)..."
                    rows={3}
                    className={`w-full text-base font-light text-black placeholder-gray-400 border  outline-none p-3 rounded-sm resize-none ${
                      validationErrors.excerpt
                        ? "border-red-300"
                        : "border-gray-200"
                    }`}
                  />
                  {validationErrors.excerpt && (
                    <p className="text-red-500 text-sm font-medium">
                      {validationErrors.excerpt}
                    </p>
                  )}
                </div>

                {/* Poster Image */}
                <div className="flex flex-col gap-1">
                  <PosterImageUpload
                    posterImage={article.posterImage}
                    onPosterImageChange={handlePosterImageChange}
                  />
                  {validationErrors.posterImage && (
                    <p className="text-red-500 text-sm font-medium">
                      {validationErrors.posterImage}
                    </p>
                  )}
                </div>

                {/* Reading Time Display */}
                {article.readingTime && (
                  <div className="space-y-2">
                    <span className="text-xs sm:text-sm font-medium text-gray-600 tracking-wide uppercase">
                      Reading Time
                    </span>
                    <p className="text-sm text-gray-600">
                      {article.readingTime} minute
                      {article.readingTime !== 1 ? "s" : ""}
                    </p>
                  </div>
                )}
              </div>

              {/* Rich Text Editor */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs sm:text-sm font-medium text-gray-600 tracking-wide uppercase">
                    Article Content
                  </label>
                  {validationErrors.content && (
                    <span className="text-red-500 text-xs font-medium">
                      {validationErrors.content}
                    </span>
                  )}
                </div>

                <div
                  className={`border transition-colors duration-200 rounded-sm overflow-hidden ${
                    validationErrors.content
                      ? "border-red-300"
                      : "border-gray-200"
                  }`}
                >
                  {isLoading ? (
                    <EditorSkeleton />
                  ) : (
                    <EditorProvider
                      initialConfig={{
                        schemaDefinition,
                        initialValue: article.content,
                      }}
                    >
                      <EventListenerPlugin
                        on={(event) => {
                          if (
                            event.type === "mutation" &&
                            event.value !== undefined
                          ) {
                            handleContentChange(event.value);
                          }
                        }}
                      />

                      <CustomToolbar />

                      <PortableTextEditable
                        style={{
                          minHeight: "400px",
                          padding: "1.5rem",
                          fontSize: "16px",
                          lineHeight: "1.6",
                        }}
                        renderStyle={renderStyle}
                        renderDecorator={renderDecorator}
                        renderBlock={renderBlock}
                        renderChild={renderChild}
                        renderListItem={(props) => <li>{props.children}</li>}
                        placeholder="Start writing your article here. Use the toolbar above for formatting..."
                      />
                    </EditorProvider>
                  )}
                </div>

                {validationErrors.content && (
                  <p className="text-red-500 text-sm font-medium">
                    {validationErrors.content}
                  </p>
                )}

                <div className="text-xs text-gray-500 font-light">
                  <p>
                    Ensure you always hit the save draft to save your work
                    locally to your device so that you don't lose your work
                  </p>
                </div>
              </div>

              {/* Auto-save Status */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 py-3 sm:py-4 border-t border-gray-100">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      article.isDraft ? "bg-orange-400" : "bg-green-400"
                    }`}
                  ></div>
                  <span className="text-xs sm:text-sm text-gray-600 font-light capitalize tracking-wide">
                    {article.isDraft ? "Draft" : "Published"}
                  </span>
                  {hasUnsavedChanges && (
                    <span className="text-xs text-orange-500 font-light">
                      • Unsaved changes
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500 font-light space-x-4">
                  <span>Last saved: {formatLastSaved(lastSaved)}</span>
                </div>
              </div>
            </div>
          ) : (
            /* Preview Mode */
            <article className="prose prose-lg max-w-none">
              {/* Preview Header */}
              <div className="not-prose mb-8 sm:mb-12">
                <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                  <div className="w-6 sm:w-8 h-px bg-blue-400"></div>
                  <span className="text-xs sm:text-sm font-medium text-blue-400 tracking-widest uppercase">
                    Preview Mode
                  </span>
                </div>
              </div>

              {/* Poster Image */}
              {article.posterImage && (
                <div className="not-prose mb-8 sm:mb-12">
                  <img
                    src={article.posterImage.src}
                    alt={article.posterImage.alt || "Poster image"}
                    className="w-full h-64 sm:h-80 object-cover rounded-lg border border-gray-200"
                  />
                </div>
              )}

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-black mb-4 sm:mb-6 leading-tight tracking-tight">
                {article.title || "Article Title"}
              </h1>

              {/* Excerpt */}
              {article.excerpt && (
                <p className="text-lg sm:text-xl text-gray-600 font-light leading-relaxed mb-8 sm:mb-12 not-prose italic border-l-4 border-blue-200 pl-4">
                  {article.excerpt}
                </p>
              )}

              {/* Meta Info */}
              <div className="not-prose mb-8 flex items-center space-x-4 text-sm text-gray-500">
                {article.readingTime && (
                  <span>{article.readingTime} min read</span>
                )}
                {article.publishedAt && (
                  <span>
                    Published{" "}
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="prose prose-lg max-w-none prose-headings:font-light prose-headings:text-black prose-p:text-black prose-p:font-light prose-p:leading-relaxed">
                <PortableText
                  components={PreviewComponents}
                  value={article.content}
                />
              </div>
            </article>
          )}
        </div>
      </div>
    </>
  );
};

export default CreateNewBlog;
