import { $ } from '@builder.io/qwik';
import { ReadInsuranceDocumentDto } from '../../dto/read-insurance-document.dto';

export function useInsuranceDocument() {
  const readOne = $(async (documentId: string) => {
    const response = await fetch(
      `http://localhost:5123/Dokumente/${documentId}`,
    );

    const document: ReadInsuranceDocumentDto = await response.json();

    return document;
  });

  return {
    readOne,
  };
}
