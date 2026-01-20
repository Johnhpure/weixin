import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface SearchResult {
    title: string;
    url: string;
    content: string;
    published_date?: string;
}

export interface TopicIdea {
    title: string;
    rationale: string;
    angle: string;
}

export interface TopicResponse {
    search_summary: string;
    sources: SearchResult[];
    topics: TopicIdea[];
}


export interface OutlineSection {
    title: string;
    description: string;
    key_points: string[];
}

export interface OutlineResponse {
    sections: OutlineSection[];
}

export interface WriteSectionResponse {
    content: string;
}

export interface ImageResponse {
    url: string;
    prompt: string;
}

export interface PolishResponse {
    polished_content: string;
}

export const articleApi = {
    polishContent: async (content: string, style: string = "Conversational"): Promise<PolishResponse> => {
        const response = await axios.post(`${API_URL}/api/articles/polish`, {
            content,
            style,
            model_provider: 'gemini'
        });
        return response.data;
    },

    generateImage: async (context: string, style: string = "Flat Vector"): Promise<ImageResponse> => {
        const response = await axios.post(`${API_URL}/api/images/generate`, {
            article_context: context,
            section_index: 0,
            style: style
        });
        return response.data;
    },

    generateOutline: async (topic: string, summary: string): Promise<OutlineResponse> => {
        const response = await axios.post(`${API_URL}/api/articles/outline`, {
            topic_title: topic,
            search_summary: summary
        });
        return response.data;
    },

    writeSection: async (title: string, desc: string, context: string): Promise<WriteSectionResponse> => {
        const response = await axios.post(`${API_URL}/api/articles/write_section`, {
            section_title: title,
            section_description: desc,
            context_summary: context
        });
        return response.data;
    }
};

export const topicApi = {

    generate: async (keyword: string, provider: string = 'gemini'): Promise<TopicResponse> => {
        const response = await axios.post(`${API_URL}/api/topics/generate`, {
            keyword,
            mode: 'creative',
            model_provider: provider,
        });
        return response.data;
    },
};
