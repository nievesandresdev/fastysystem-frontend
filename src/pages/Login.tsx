import { LoginForm } from '@/components/Auth';

export default function Login() {
  return (
      <div className="h-screen flex">
        {/* background left */}
        <div
          className="w-[50%] h-full bg-gradient-to-r flex relative"
        >
          <div className="absolute h-full  w-full z-[-1] flex bg-[#ffffef]">
            <div className="w-[500px] h-[500px] flex flex-col m-auto">
                <div className="flex-grow bg-[#F4A261] rounded-t-[6px]"></div>
                <div className="flex-grow bg-[#0A9396]"></div>
                <div className="flex-grow bg-[#005F73] rounded-b-[6px]"></div>
            </div>
          </div>
          <img className="w-[300px] h-[300px] rounded-[4px] shadow-lg m-auto" src="/img/logo.png" alt="" />
        </div>
        {/* login form */}
        <div className="flex h-full flex-grow shadow-2xl">
          <div className="m-auto w-[400px]">

            <h2 className="text-[42px] font-bold text-center w-full">
              <span className="text-red-1">Bien</span>
              <span className="text-blue-1">ven</span>
              <span className="text-blue-2">ido</span>
            </h2>
            <LoginForm />
            
          </div>
        </div>
      </div>
  );
}
