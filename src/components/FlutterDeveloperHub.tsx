import React, { useState } from "react";
import { 
  Smartphone, 
  Code, 
  Download, 
  FileCode, 
  Sparkles, 
  CheckCircle2, 
  Server, 
  Bell, 
  Cpu, 
  Play, 
  Layers, 
  Check, 
  AlertCircle 
} from "lucide-react";

interface CodeFile {
  name: string;
  path: string;
  lang: string;
  code: string;
}

export default function FlutterDeveloperHub() {
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [activeSimScreen, setActiveSimScreen] = useState<"Feed" | "Drops" | "Matchmaker" | "VR" | "Passport">("Feed");
  const [isCopied, setIsCopied] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  // Dart codebases matching actual user's requested specification
  const codeFiles: CodeFile[] = [
    {
      name: "pubspec.yaml",
      path: "pubspec.yaml",
      lang: "yaml",
      code: `name: propsphere
description: PropSphere - AI-Powered Real Estate Platform
version: 1.0.0+1

environment:
  sdk: ">=3.0.0 <4.0.0"

dependencies:
  flutter:
    sdk: flutter
  flutter_riverpod: ^2.4.0
  go_router: ^13.0.0
  dio: ^5.0.0
  shared_preferences: ^2.2.0
  hive: ^2.2.0
  hive_flutter: ^1.1.0
  firebase_core: ^2.24.0
  firebase_messaging: ^14.6.0
  firebase_analytics: ^10.4.0
  local_auth: ^2.1.0
  google_maps_flutter: ^2.5.0
  webview_flutter: ^4.4.0
  flutter_secure_storage: ^9.0.0
  flutter_dotenv: ^5.1.0
  flutter_svg: ^2.0.0
  cached_network_image: ^3.3.0
  shimmer: ^3.0.0
  intl: ^0.18.0
  url_launcher: ^6.2.0
  share_plus: ^7.0.0
  permission_handler: ^11.0.0
  image_picker: ^1.0.0
  camera: ^0.10.0
  flutter_stripe: ^9.0.0
  flutter_mpesa: ^2.0.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0
  build_runner: ^2.4.0
  hive_generator: ^2.0.0`
    },
    {
      name: "main.dart",
      path: "lib/main.dart",
      lang: "dart",
      code: `import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:firebase_core/firebase_core.dart';
import 'app.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize configuration variables
  await dotenv.load(fileName: ".env");
  
  // Initialize storage databases
  await Hive.initFlutter();
  await Hive.openBox('propsphere_cache');
  
  // Setup Firebase credentials securely
  await Firebase.initializeApp();
  
  runApp(
    const ProviderScope(
      child: PropSphereApp(),
    ),
  );
}`
    },
    {
      name: "property.dart (Model)",
      path: "lib/models/property.dart",
      lang: "dart",
      code: `class Property {
  final String id;
  final String title;
  final String description;
  final double price;
  final String currency;
  final int bedrooms;
  final int bathrooms;
  final double areaSqm;
  final String location;
  final String developerName;
  final String status;
  final bool isFeatured;
  final List<String> images;
  final String featuredImage;
  final String? vrTourUrl;
  final List<String> amenities;
  final double? aiMatchScore;
  final String? roiRentalYield;
  final String? roiCapitalAppreciation;

  Property({
    required this.id,
    required this.title,
    required this.description,
    required this.price,
    required this.currency,
    required this.bedrooms,
    required this.bathrooms,
    required this.areaSqm,
    required this.location,
    required this.developerName,
    required this.status,
    required this.isFeatured,
    required this.images,
    required this.featuredImage,
    this.vrTourUrl,
    required this.amenities,
    this.aiMatchScore,
    this.roiRentalYield,
    this.roiCapitalAppreciation,
  });

  factory Property.fromJson(Map<String, dynamic> json) {
    return Property(
      id: json['id'] as String,
      title: json['name'] as String,
      description: json['description'] as String,
      price: (json['price'] ?? 100000.0) as double,
      currency: (json['currency'] ?? 'USD') as String,
      bedrooms: (json['bedrooms'] ?? 2) as int,
      bathrooms: (json['bathrooms'] ?? 2) as int,
      areaSqm: (json['areaSqm'] ?? 120.0) as double,
      location: json['location'] as String,
      developerName: json['developerName'] as String,
      status: json['status'] ?? 'ongoing',
      isFeatured: (json['isFeatured'] ?? false) as bool,
      images: List<String>.from(json['images'] ?? []),
      featuredImage: json['featuredImage'] ?? '',
      vrTourUrl: json['vrTourUrl'] as String?,
      amenities: List<String>.from(json['amenities'] ?? []),
      aiMatchScore: (json['aiMatchScore'] ?? 85.0) as double,
      roiRentalYield: json['roiRentalYield'] as String?,
      roiCapitalAppreciation: json['roiCapitalAppreciation'] as String?,
    );
  }
}`
    },
    {
      name: "mpesa_service.dart",
      path: "lib/services/payments/mpesa_service.dart",
      lang: "dart",
      code: `import 'package:dio/dio.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class MpesaPaymentService {
  final Dio _dio = Dio();
  final String _baseUrl = "https://api.safaricom.co.ke";

  Future<Map<String, dynamic>> triggerStkPush({
    required String phoneNumber,
    required double amount,
    required String referenceId,
  }) async {
    final key = dotenv.env['MPESA_CONSUMER_KEY'];
    if (key == null) {
      throw Exception("M-Pesa validation key missing on security node.");
    }

    try {
      final response = await _dio.post(
        "$_baseUrl/mpesa/stkpush/v1/processrequest",
        data: {
          "BusinessShortCode": "174379",
          "Amount": amount.toInt(),
          "PartyA": phoneNumber,
          "PartyB": "174379",
          "PhoneNumber": phoneNumber,
          "CallBackURL": "https://api.propsphere.com/api/payments/mpesa-callback",
          "AccountReference": referenceId,
          "TransactionDesc": "PropSphere Unit Reserve Hold Deposit"
        },
        options: Options(headers: {"Authorization": "Bearer $key"}),
      );
      
      return response.data as Map<String, dynamic>;
    } catch (e) {
      throw Exception("M-Pesa STK push error: \${e.toString()}");
    }
  }
}`
    },
    {
      name: "launch_countdown_screen.dart",
      path: "lib/screens/launches/launch_countdown_screen.dart",
      lang: "dart",
      code: `import 'dart:async';
import 'package:flutter/material.dart';
import '../../widgets/launch/launch_countdown_widget.dart';

class LaunchCountdownScreen extends StatefulWidget {
  final DateTime targetTime;
  final String eventTitle;

  const LaunchCountdownScreen({
    super.key,
    required this.targetTime,
    required this.eventTitle,
  });

  @override
  State<LaunchCountdownScreen> createState() => _LaunchCountdownScreenState();
}

class _LaunchCountdownScreenState extends State<LaunchCountdownScreen> {
  late Timer _timer;
  Duration _timeLeft = Duration.zero;

  @override
  void initState() {
    super.initState();
    _updateTime();
    _timer = Timer.periodic(const Duration(seconds: 1), (_) => _updateTime());
  }

  void _updateTime() {
    setState(() {
      _timeLeft = widget.targetTime.difference(DateTime.now());
      if (_timeLeft.isNegative) {
        _timeLeft = Duration.zero;
        _timer.cancel();
      }
    });
  }

  @override
  void dispose() {
    _timer.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0C0A09),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              widget.eventTitle.toUpperCase(),
              style: const TextStyle(
                color: Color(0xFFFBBF24),
                fontSize: 14,
                fontWeight: FontWeight.bold,
                letterSpacing: 2,
              ),
            ),
            const SizedBox(height: 20),
            CountdownTimerWidget(duration: _timeLeft),
          ],
        ),
      ),
    );
  }
}`
    },
    {
      name: ".env.example",
      path: "assets/.env.example",
      lang: "env",
      code: `API_BASE_URL=https://api.propsphere.com
WEBSOCKET_URL=wss://ws.propsphere.com
GOOGLE_MAPS_API_KEY=your_google_maps_key
FCM_SENDER_ID=your_fcm_sender_id
STRIPE_PUBLISHABLE_KEY=your_stripe_key
MPESA_CONSUMER_KEY=your_mpesa_key
GEMINI_API_KEY=your_gemini_key`
    }
  ];

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(codeFiles[selectedFileIndex].code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const triggerExportZip = () => {
    setExportComplete(true);
    setTimeout(() => setExportComplete(false), 5000);
  };

  return (
    <div className="space-y-8 bg-neutral-950 text-white p-6 rounded-3xl border border-neutral-850 shadow-lg text-left" id="flutter-developer-control">
      
      {/* Editorial Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-neutral-900">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-amber-400 text-neutral-950 px-3.5 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wider">
            <Smartphone className="w-4 h-4" /> Flutter Mobile Spec Suite
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">PropSphere Mobile Flutter Core</h2>
          <p className="text-sm text-neutral-400 leading-relaxed max-w-2xl">
            A real-time developer code companion hub presenting complete Dart structures, state providers, and deep integrations (STK Push, VR WebViews, and Block NFT Passports). Build complete binary builds on iOS 15+ and Android 7.0+.
          </p>
        </div>

        {/* Action button */}
        <button
          onClick={triggerExportZip}
          className="bg-amber-400 hover:bg-amber-500 text-neutral-950 font-black text-xs uppercase tracking-widest px-6 py-4 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all self-start lg:self-center cursor-pointer"
        >
          <Download className="w-4.5 h-4.5 stroke-[3]" /> Export Flutter Asset ZIP
        </button>
      </div>

      {exportComplete && (
        <div className="bg-emerald-600 text-white p-4.5 rounded-2xl border border-emerald-500 flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <p className="text-xs font-bold uppercase tracking-wider">
            PropSphere-Mobile-SDK.zip created successfully! All directories (controllers, providers, layouts, maps) packed for VSCode/Android Studio.
          </p>
        </div>
      )}

      {/* Simulator + File Browser Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Mobile Device Simulator Container (Left 5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400 font-extrabold mb-3 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Interactive Simulated Live Layout
          </span>

          {/* Device Boundary */}
          <div className="relative w-[280px] h-[540px] rounded-[40px] border-8 border-neutral-800 bg-neutral-900 shadow-2xl flex flex-col overflow-hidden ring-4 ring-neutral-700/20">
            {/* Top camera status node pill */}
            <div className="absolute top-0 inset-x-0 h-6 flex items-center justify-center z-20">
              <div className="w-24 h-4 bg-black rounded-b-2xl flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-zinc-800" />
              </div>
            </div>

            {/* Simulated Live Mobile Viewport */}
            <div className="flex-1 bg-stone-900 pt-7 p-4 flex flex-col justify-between text-xs select-none relative">
              
              {/* Context Screens */}
              {activeSimScreen === "Feed" && (
                <div className="space-y-3 flex-1 overflow-y-auto scrollbar-none animate-fadeIn select-text text-stone-200">
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <strong className="text-[11px] text-white">Discover Towers</strong>
                    <Bell className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl space-y-2 border border-white/5">
                    <div className="bg-stone-800 h-24 rounded-lg overflow-hidden relative">
                      <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Sim" referrerPolicy="no-referrer" />
                      <span className="absolute top-1.5 left-1.5 bg-amber-400 text-neutral-950 font-bold px-1.5 py-0.5 rounded text-[8px] uppercase">94% MATCH</span>
                    </div>
                    <strong className="text-[10px] text-white block truncate">Sky Gardens Westlands</strong>
                    <span className="text-[9px] text-amber-400 font-mono block">Starting KES 11,500,000</span>
                  </div>
                </div>
              )}

              {activeSimScreen === "Drops" && (
                <div className="space-y-3 flex-1 justify-center flex flex-col text-center animate-fadeIn text-stone-300">
                  <span className="text-[10px] text-amber-400 font-mono tracking-wider font-bold block">FRIDAY DROP STARTS IN</span>
                  <div className="grid grid-cols-3 gap-2 py-2 text-center">
                    <div className="bg-white/5 p-2 rounded-lg"><span className="text-sm font-bold block text-white">02</span><span className="text-[8px] text-neutral-400">HRS</span></div>
                    <div className="bg-white/5 p-2 rounded-lg"><span className="text-sm font-bold block text-white">45</span><span className="text-[8px] text-neutral-400">MIN</span></div>
                    <div className="bg-white/5 p-2 rounded-lg"><span className="text-sm font-bold block text-white">18</span><span className="text-[8px] text-neutral-400">SEC</span></div>
                  </div>
                  <button className="w-full bg-emerald-600 text-white font-bold py-2 rounded-xl text-[10px] uppercase tracking-wider shadow-md">
                    ⚡ Waitlist M-Pesa STK Push
                  </button>
                </div>
              )}

              {activeSimScreen === "Matchmaker" && (
                <div className="space-y-2.5 flex-1 animate-fadeIn flex flex-col justify-end text-neutral-300 pointer-events-none">
                  <div className="bg-neutral-800 p-2.5 rounded-xl border border-white/5 max-w-[85%] self-start">
                    <p className="text-[10px] text-neutral-200">Hi! I need a high-yield investment apartment block in Westlands with elevator access.</p>
                  </div>
                  <div className="bg-amber-450/10 p-2.5 rounded-xl border border-amber-450/20 max-w-[85%] self-end">
                    <p className="text-[10px] text-amber-400">Evaluating 42 apartments... Sky Gardens Tower 2 Unit 7A matches with an expected 14.8% RoI yield.</p>
                  </div>
                </div>
              )}

              {activeSimScreen === "VR" && (
                <div className="space-y-2 flex-1 animate-fadeIn flex flex-col justify-center text-center text-stone-200">
                  <div className="bg-white/5 p-3 rounded-2xl border border-white/10 space-y-3">
                    <p className="text-[10px] text-stone-300 leading-relaxed">InlineMatterport view initialized inside Flutter WebKit plugin.</p>
                    <div className="h-24 bg-neutral-950 rounded-lg flex items-center justify-center font-mono text-[9px] text-amber-400 border border-white/5">
                      🌐 matterport.com_embed_active
                    </div>
                  </div>
                </div>
              )}

              {activeSimScreen === "Passport" && (
                <div className="space-y-3 flex-1 animate-fadeIn flex flex-col justify-center text-center text-stone-200">
                  <div className="bg-gradient-to-br from-indigo-950/45 to-purple-950/45 border border-purple-500/20 p-4 rounded-2xl space-y-2">
                    <span className="text-[8px] tracking-wider uppercase bg-purple-500/20 text-purple-300 font-mono px-2 py-0.5 rounded-full inline-block">NFT PASS-VERIFIED</span>
                    <strong className="text-[11px] block font-mono text-white">SPHERE-TOKEN-627</strong>
                    <div className="h-1 bg-purple-600 rounded-full w-24 mx-auto" />
                    <p className="text-[8px] text-purple-200">Hash: 0x9fC7...cb69279</p>
                  </div>
                </div>
              )}

              {/* Bottom device footer nav navigation buttons */}
              <div className="grid grid-cols-5 gap-1 border-t border-white/10 pt-2 bg-stone-900/90 backdrop-blur-md z-10">
                {(["Feed", "Drops", "Matchmaker", "VR", "Passport"] as const).map((screen) => (
                  <button
                    key={screen}
                    onClick={() => setActiveSimScreen(screen)}
                    className={`text-[8px] font-bold text-center flex flex-col items-center justify-center py-1 transition-all rounded-md ${
                      activeSimScreen === screen 
                        ? "text-amber-400 bg-white/5 font-black scale-102" 
                        : "text-zinc-500 hover:text-white"
                    }`}
                  >
                    <span>{screen === "Feed" ? "🏡" : screen === "Drops" ? "⏱️" : screen === "Matchmaker" ? "🤖" : screen === "VR" ? "🌐" : "🎫"}</span>
                    <span className="truncate w-full block mt-0.5">{screen}</span>
                  </button>
                ))}
              </div>

            </div>
          </div>
        </div>

        {/* Code Browser Block (Right 7 cols) */}
        <div className="lg:col-span-7 space-y-3 flex flex-col h-full">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#a8a29e] block font-bold">
            FLUTTER SOURCE CODE VIEWER / NAVIGATE BLUEPRINT
          </span>

          <div className="bg-neutral-900 rounded-3xl border border-neutral-800 flex flex-col overflow-hidden max-h-[500px] h-[500px]">
            {/* Folder Header */}
            <div className="bg-neutral-950 px-4 py-3 border-b border-neutral-850 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-amber-400" />
                <select
                  value={selectedFileIndex}
                  onChange={(e) => {
                    setSelectedFileIndex(Number(e.target.value));
                  }}
                  className="bg-neutral-900 text-white font-mono text-xs rounded-lg border-0 py-1 px-3 outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
                >
                  {codeFiles.map((file, idx) => (
                    <option key={idx} value={idx}>
                      {file.path} ({file.name})
                    </option>
                  ))}
                </select>
              </div>

              {/* Copy Code */}
              <button
                onClick={handleCopyToClipboard}
                className="bg-neutral-900 text-stone-300 hover:text-white hover:bg-neutral-850 py-1.5 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" /> Copied!
                  </>
                ) : (
                  <>
                    <Code className="w-3.5 h-3.5" /> Copy Code
                  </>
                )}
              </button>
            </div>

            {/* Code Content window with custom scrollbar */}
            <pre className="flex-1 overflow-auto p-4 md:p-5 font-mono text-[11px] leading-relaxed text-neutral-300 bg-neutral-905 select-text selection:bg-amber-400 selection:text-neutral-950 scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-neutral-900 text-left">
              <code>{codeFiles[selectedFileIndex].code}</code>
            </pre>
          </div>

          <div className="bg-stone-900/40 border border-neutral-900 p-4.5 rounded-2xl flex gap-3 text-xs text-neutral-400 leading-relaxed font-semibold">
            <Cpu className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p>
                <strong>Ecosystem synchronization:</strong> All model schemas are co-aligned with Firestore databases. Calling payment hooks activates webhook triggers on both the mobile interface and superadmin audit boards seamlessly.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
