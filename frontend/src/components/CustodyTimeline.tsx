import { FileCheck, Eye, Download, ShieldCheck, Clock } from 'lucide-react';

interface CustodyEvent {
    id: string;
    action: 'UPLOAD' | 'VIEW' | 'DOWNLOAD' | 'SHARE';
    actorName: string;
    timestamp: string;
    hash?: string;
}

// Mock Data representing backend logs
const logs: CustodyEvent[] = [
    { id: '1', action: 'UPLOAD', actorName: 'Client (Rajesh)', timestamp: '2023-10-24 10:30 AM', hash: 'e3b0c442...' },
    { id: '2', action: 'VIEW', actorName: 'Adv. Arjun Verma', timestamp: '2023-10-25 09:15 AM' },
    { id: '3', action: 'DOWNLOAD', actorName: 'Adv. Arjun Verma', timestamp: '2023-10-25 09:20 AM' },
];

export function CustodyTimeline() {
    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
                <ShieldCheck className="text-[#D4AF37]" size={24} />
                <div>
                    <h3 className="font-bold text-gray-900 text-lg">Chain of Custody</h3>
                    <p className="text-xs text-gray-500">Tamper-proof audit trail for this evidence.</p>
                </div>
            </div>

            <div className="space-y-0">
                {logs.map((log, index) => (
                    <div key={log.id} className="flex gap-4 relative group">
                        {/* Connecting Line */}
                        {index !== logs.length - 1 && (
                            <div className="absolute left-[19px] top-8 bottom-0 w-0.5 bg-gray-100 group-hover:bg-[#D4AF37]/30 transition-colors"></div>
                        )}

                        {/* Icon Bubble */}
                        <div className={`
                            w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 border-2 transition-all
                            ${log.action === 'UPLOAD' ? 'bg-blue-50 border-blue-200 text-blue-600' : ''}
                            ${log.action === 'VIEW' ? 'bg-gray-50 border-gray-200 text-gray-600' : ''}
                            ${log.action === 'DOWNLOAD' ? 'bg-green-50 border-green-200 text-green-600' : ''}
                        `}>
                            {log.action === 'UPLOAD' && <FileCheck size={18} />}
                            {log.action === 'VIEW' && <Eye size={18} />}
                            {log.action === 'DOWNLOAD' && <Download size={18} />}
                        </div>

                        {/* Content */}
                        <div className="pb-8">
                            <p className="text-sm font-bold text-gray-900">
                                {log.action === 'UPLOAD' && 'Evidence Uploaded & Hashed'}
                                {log.action === 'VIEW' && 'Evidence Accessed'}
                                {log.action === 'DOWNLOAD' && 'Evidence Exported'}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">by <span className="font-medium text-gray-700">{log.actorName}</span></p>
                            <div className="flex items-center gap-4 mt-2">
                                <span className="text-[10px] text-gray-400 flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                                    <Clock size={10} /> {log.timestamp}
                                </span>
                                {log.hash && (
                                    <span className="text-[10px] font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded border border-gray-100" title={log.hash}>
                                        Hash: {log.hash.substring(0, 12)}...
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}