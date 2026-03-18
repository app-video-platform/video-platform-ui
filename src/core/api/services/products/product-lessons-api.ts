/* eslint-disable no-console */
import httpClient from '../../http-client';
import {
  CourseLesson,
  LessonCreate,
  RemoveLessonPayload,
} from 'core/api/models';

export const createLessonAPI = async (payload: LessonCreate) => {
  try {
    const response = await httpClient.post<CourseLesson>(
      `api/products/${payload.productId}/sections/${payload.sectionId}/lessons`,
      {
        title: payload.title,
        type: payload.type,
        videoUrl: payload.videoUrl,
        content: payload.content,
        description: payload.description,
        position: payload.position,
      },
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error creating lesson:', error);
    throw error;
  }
};

export const updateLessonDetailsAPI = async (payload: CourseLesson) => {
  try {
    const response = await httpClient.patch<CourseLesson>(
      `api/products/${payload.productId}/sections/${payload.sectionId}/lessons/${payload.id}`,
      {
        title: payload.title,
        type: payload.type,
        videoUrl: payload.videoUrl,
        content: payload.content,
        description: payload.description,
        position: payload.position,
      },
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error updating lesson:', error);
    throw error;
  }
};

export const deleteLessonAPI = async (payload: RemoveLessonPayload) => {
  const lessonId = payload.lessonId ?? payload.id ?? '';

  try {
    await httpClient.delete(
      `api/products/${payload.productId}/sections/${payload.sectionId}/lessons/${lessonId}`,
    );
    return lessonId;
  } catch (error) {
    console.error('Error deleting lesson:', error);
    throw error;
  }
};
