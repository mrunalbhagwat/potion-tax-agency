import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TaxSubmissionService {
    private baseUrl = 'https://truetax.creativehand.co.in';

    constructor(private http: HttpClient) { }

    submitStep1(taxType: string): Observable<any> {
        const body = {
            session_id: null,
            tax_type: this.mapTaxType(taxType),
        };
        return this.http.post(`${this.baseUrl}/api/tax-submissions/step-1`, body);
    }

    submitStep2(sessionId: string, taxYear: string) {
        const body = { session_id: sessionId, tax_year: taxYear };
        return this.http.post(`${this.baseUrl}/api/tax-submissions/step-2`, body);
    }

    submitStep4(sessionId: string, payload: any) {
        const body = {
            session_id: sessionId,
            has_referral: payload.referred === 'Yes',
            referral_full_name: payload.referrerName || null,
            occupation: payload.occupation,
            date_of_birth: payload.dob,
            address: payload.address,
            city: payload.city,
            state: payload.state,
        };
        console.log('Step 3 payload:', body); // Debug log
        return this.http.post(`${this.baseUrl}/api/tax-submissions/step-4`, body);
    }

    submitStep5(sessionId: string, payload: any) {
        const body: any = {
            session_id: sessionId,
            filing_jointly_with_spouse: payload.filingWithSpouse === 'Yes',
        };

        if (payload.filing_jointly_with_spouse === 'Yes') {
            body.spouse_full_name = payload.spouseFullName || null;
            body.spouse_occupation = payload.spouseOccupation || null;
            body.spouse_date_of_birth = payload.dob || null;
        }

        return this.http.post(`${this.baseUrl}/api/tax-submissions/step-5`, body);
    }

    submitStep6(sessionId: string, payload: any) {
        const body: any = {
            session_id: sessionId,
            claiming_dependents: payload.claimingDependants === 'Yes'
        };

        if (payload.claiming_dependents === 'Yes') {
            body.dependents = payload.dependants.map((d: any) => ({
                full_name: d.fullName,
                occupation: d.occupation,
                date_of_birth: d.dob || null
            }));
        }

        return this.http.post(`${this.baseUrl}/api/tax-submissions/step-6`, body);
    }

    uploadDocuments(sessionId: string, docs: any[]) {
        const formData = new FormData();

        // ✅ Boolean values must be sent as numbers or JSON booleans
        formData.append('session_id', sessionId);
        formData.append('paid_for_childcare', JSON.stringify(false));
        formData.append('has_income_documents', JSON.stringify(true));
        formData.append('has_additional_income_documents', JSON.stringify(true));

        // ✅ Append files properly
        docs.forEach((doc, index) => {
            if (doc.file) {
                let type = '';
                if (doc.label.includes('W-2')) type = 'w2_form';
                else if (doc.label.includes('1099-INT')) type = '1099_int';
                else if (doc.label.includes('1099-DIV')) type = '1099_div';
                else type = 'other';

                formData.append(`documents[${index}][document_type]`, type);
                formData.append(`documents[${index}][file]`, doc.file);
            }
        });

        return this.http.post(`${this.baseUrl}/api/tax-submissions/step-7`, formData);
    }

    submitStep7(data: FormData) {
        return this.http.post(`${this.baseUrl}/api/tax-submissions/step-7`, data);
    }

    submitStep8(data: any) {
        return this.http.post(`${this.baseUrl}/api/tax-submissions/step-8`, data);
    }

    uploadBusinessDocumentsStep9(sessionId: string, docs: { label: string; file?: File }[]): Observable<any> {
        const formData = new FormData();
        formData.append('session_id', sessionId);

        docs.forEach((doc, index) => {
            if (!doc.file) return;

            // map label -> expected document_type (lowercase underscore)
            let documentType = 'other';
            if (doc.label.toLowerCase().includes('1099-nec') || doc.label.toLowerCase().includes('1099-nec') || doc.label.toLowerCase().includes('1099 nec')) {
                documentType = '1099_nec';
            } else if (doc.label.toLowerCase().includes('retire') || doc.label.toLowerCase().includes('retirement')) {
                documentType = 'retirement_statements';
            } else if (doc.label.toLowerCase().includes('stock') || doc.label.toLowerCase().includes('crypto')) {
                documentType = 'stocks_crypto';
            }

            // append metadata + file exactly as backend expects
            formData.append(`documents[${index}][document_type]`, documentType);
            formData.append(`documents[${index}][file]`, doc.file, doc.file.name);
        });

        // debug preview - remove in production
        console.log('Uploading step-9 FormData:');
        for (const pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }

        return this.http.post(`${this.baseUrl}/api/tax-submissions/step-9`, formData);
    }

    submitAdditionalInfoStep10(data: any) {
        return this.http.post(`${this.baseUrl}/api/tax-submissions/step-10`, data);
    }

    uploadStep11Documents(formData: FormData) {
        return this.http.post(
            'https://truetax.creativehand.co.in/api/tax-submissions/step-11',
            formData
        );
    }

    submitStep12Referral(payload: any) {
        return this.http.post(
            `${this.baseUrl}/api/tax-submissions/step-12`,
            payload
        );
    }

    submitStep12(data: any) {
        return this.http.post(`${this.baseUrl}/api/tax-submissions/step-13`, data);
    }



    private mapTaxType(label: string): string {
        switch (label) {
            case 'Personal Tax':
                return 'personal';
            case 'MTD for Income Tax':
                return 'mtd_income';
            case 'Company Tax':
                return 'company';
            case 'Partnership Tax':
                return 'partnership';
            default:
                return 'personal';
        }
    }
}
